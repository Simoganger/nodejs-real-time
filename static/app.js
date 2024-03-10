
"use strict"

// api Url
const API = "http://localhost:3000"
const WS_API = "ws://localhost:3000"


// populate products from API method
const populateProducts = async (category, method = "GET", payload) => {
    const products = document.querySelector("#products");
    products.innerHTML = "";

    // send request
    const send = method === "GET" ? {} : {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }

    // get data
    const res = await fetch(`${API}/${category}`, { method, ...send });
    const data = await res.json();

    // populate product
    for (const product of data) {
        const item = document.createElement("product-item")
        item.dataset.id = product.id;
        for (const key of ["name", "rrp", "info"]) {
            const span = document.createElement("span")
            span.slot = key
            span.textContent = product[key]
            item.appendChild(span)
        }
        // append to DOM
        products.appendChild(item)
    }
}

// get elements from DOM
const category = document.querySelector("#category")
const add = document.querySelector("#add")


// realtime orders handler using WebSocket
let socket = null;
const realtimeOrders = (category) => {
    if(socket === null) {
        socket = new WebSocket(`${WS_API}/orders/${category}`);
    } else {
        // send update-category command to server
        socket.send(JSON.stringify({ cmd: "update-category", payload: { category }}));
    }
    
    // listen for messages
    socket.addEventListener("message", ({ data }) => {
        try {
            const { id, total } = JSON.parse(data);
            const item = document.querySelector(`[data-id="${id}"]`)
            if(item === null) return;
            const span = item.querySelector('[slot="orders"]') 
            || document.createElement("span");
            span.slot = "orders";
            span.textContent = total;
            item.appendChild(span);
        } catch(err) {
            console.error(err);
        }
    })
}


// populate products on page load
category.addEventListener("input", async ({ target }) => {
    add.style.display = "block"
    await populateProducts(target.value)
    realtimeOrders(target.value);
})

// add product from handler
add.addEventListener("submit", async (e) => {
    e.preventDefault()
    const { target } = e
    const payload = {
        name: target.name.value,
        rrp: target.rrp.value,
        info: target.info.value,
    }
    await populateProducts(category.value, "POST", payload)
    realtimeOrders(category.value)

    // reset form
    target.reset()
})


// define custom element
customElements.define("product-item", 
class Item extends HTMLElement {
    constructor() {
        super()
        const itemTmpl = document.querySelector("#item").content.cloneNode(true)
        this.attachShadow({ mode: "open" }).appendChild(itemTmpl)
    }
})