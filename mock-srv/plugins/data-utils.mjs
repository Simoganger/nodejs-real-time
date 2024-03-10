"use strict"

import fastify from "fastify";
import fp from "fastify-plugin"
import { PassThrough } from "node:stream";

// mock data
const orders = {
    A1: { total: 3 },
    A2: { total: 7 },
    B1: { total: 101 }
}

// map category to id prefix
const catToPrefix = {
    electronics: "A",
    confectionery: "B"
}

// create a stream of orders
const orderStream = new PassThrough({ objectMode: true });

// simulate real-time orders
async function* realtimeOrders() {
    for await (const { id, total } of orderStream) {
        yield JSON.stringify({ id, total });
    }
}

// add order to stream and update total
function addOrder(id, amount) {
    if (orders.hasOwnProperty(id) === false) {
        const err = new Error(`Order ${id} not found`);
        err.status = 404;
        throw err;
    }
    if (Number.isInteger(amount) === false) {
        const err = new Error("Supplied amount must be an integer");
        err.status = 400;
        throw err;
    }
    orders[id].total += amount;
    const { total } = orders[id];
    console.log("Adding order: %o", { id, total });
    orderStream.write({ id, total });
}

function* currentOrders(category) {
    const idPrefix = catToPrefix[category];
    if(!idPrefix) return;
    const ids = Object.keys(orders).filter((id) => id[0] === idPrefix);
    
    for (const id of ids) {
        yield JSON.stringify({ id, ...orders[id] });
    }
}

const calculateId = (idPrefix, data) => {
    const sorted = [...new Set(data.map(({ id }) => id))];
    const next = Number(sorted.pop().slice(1)) + 1;
    return `${idPrefix}${next}`;
}

export default fp (async function (fastify, opts) {
    fastify.decorate("currentOrders", currentOrders);
    fastify.decorate("realtimeOrders", realtimeOrders);
    fastify.decorate("addOrder", addOrder);
    fastify.decorate("mockDataInsert", function (request, category, data) {
        const idPrefix = catToPrefix[category];
        const id = calculateId(idPrefix, data);
        data.push({ id, ...request.body });
        return data;
    })
})