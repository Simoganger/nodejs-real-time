#!/usr/bin/env node

import { Command } from "commander";
import { 
    listCategories, 
    update, 
    add, 
    listCategoryItems } from "../src/utils.js";

const program = new Command();

const API = "http://localhost:3000";

// log the usage of the command to the console
const usage = (msg = "Back office for my app") => {
    console.log(`\n${msg}\n`);
};


// create a new program
program
    .name("my-cli")
    .description("Back office of my app")
    .version("1.0.0");

// create a command for adding a new order
program
    .command("update")
    .argument("<ID>", "Order ID")
    .argument("<AMOUNT>", "Order Amount")
    .action(async (id, amount) => await update(id, amount));

// create a command for listing categories bu IDs
program
    .command("add")
    .description("Add product by ID to the category")
    .argument("<CATEGORY>", "Product Category")
    .argument("<ID>", "Product ID")
    .argument("<NAME>", "Product Name")
    .argument("<AMOUNT>", "Product RRP")
    .argument("[INFO...]", "Product Info")
    .action(
        async (category, id, name, amount, info) => 
            await add(category, id, name, amount, info));

// create a command for listing categories
program
    .command("list")
    .description("List categories")
    .argument("[CATEGORY]", "Category to list IDs for")
    .option("-a, --all", "List all categories")
    .action(async (args, opts) => {
        if (args && opts.all)
            throw new Error("Cannot specify both category and 'all'");
        if (opts.all || args === 'all') {
            listCategories();
        } else if (args === "confectionery" || args === "electronics") {
            await listCategoryItems(args);
        } else {
            throw new Error("Invalid category specified");
        }
    });

program.parse();