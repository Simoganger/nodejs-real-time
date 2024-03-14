#!/usr/bin/env node

import { Command } from "commander";
import {
    listCategories,
    update,
    add,
    listCategoryItems
} from "../src/utils.js";
import { interactiveApp } from "../src/prompts.js";

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
    .version("1.0.0")
    .option("-i, --interactive", "Run APp in interactive mode")
    .action(() => {
        // No-operation (noop)
    })

// create a command for updating an order
program
    .command("update")
    .description("Update an order")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[ID]", "Order ID")
    .argument("[AMOUNT]", "Order Amount");


// create a command for listing categories by IDs
program
    .command("add")
    .description("Add product by ID to the category")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[CATEGORY]", "Product Category")
    .argument("[ID]", "Product ID")
    .argument("[NAME]", "Product Name")
    .argument("[AMOUNT]", "Product RRP")
    .argument("[INFO...]", "Product Info");
    /*.action(
        async (category, id, name, amount, info) =>
            await add(category, id, name, amount, info));*/

// create a command for listing categories
program
    .command("list")
    .description("List categories")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .option("-a, --all", "List all categories")
    .argument("[CATEGORY]", "Category to list IDs for");
    /*.action(async (args, opts) => {
        if (args && opts.all)
            throw new Error("Cannot specify both category and 'all'");
        if (opts.all || args === 'all') {
            listCategories();
        } else if (args === "confectionery" || args === "electronics") {
            await listCategoryItems(args);
        } else {
            throw new Error("Invalid category specified");
        }
    });*/


// create a command for adding a new order
/*program
    .command("update")
    .option("-i, --interactive", "Run Update Command in interactive mode")
    .argument("[ID]", "Order ID")
    .argument("[AMOUNT]", "Order Amount")
    .action(async (id, amount) => await update(id, amount));*/

program.parse();


// Main function to run the program
async function main(program) {
    // Get the command, process.args and options
    const command = program?.args.at(0) || "";
    const cliArgs = program?.args.slice(1) || [];
    const options = program?.opts() || {};
  
    // Guard clauses
    if (!command && !options.interactive) {
      // Display the help
      program.help();
    }
    if (!command && options.interactive) {
      // Run the interactive app
      return interactiveApp();
    }
    if (command && options.interactive) {
      // Run the interactive app with the command
      return interactiveApp(command);
    }
    if (options.interactive && cliArgs.length > 0) {
      throw new Error("Cannot specify both interactive and command");
      process.exit(1);
    }
    // Execute the command
    switch (command) {
      case "add": {
        const [category, id, name, amount, info] = cliArgs;
        if (
          !categories.includes(category) ||
          !category ||
          !id ||
          !name ||
          !amount
        ) {
          throw new Error("Invalid arguments specified");
        }
        await add(category, id, name, amount, info);
        break;
      }
      case "update": {
        const [id, amount] = cliArgs;
        if (!id && !amount) {
          throw new Error("Invalid arguments specified");
        }
        await update(id, amount);
        break;
      }
      case "list": {
        const { all } = options;
        const [category] = cliArgs;
        if (category && all)
          throw new Error("Cannot specify both category and 'all'");
        if (all || category === "all") {
          listCategories();
        } else if (categories.includes(category)) {
          await listCategoryItems(category);
        } else {
          throw new Error("Invalid category specified");
        }
        break;
      }
      default:
        await interactiveApp();
    }
  }
  // Run the main function
  main(program);


