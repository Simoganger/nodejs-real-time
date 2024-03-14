import Enquirer from "enquirer";
import { add, categories, listCategoryItems, update, log, listCategories } from "./utils.js";
import { Command } from "commander";
import { displayInfo, displayText } from "./displays.js";

const { prompt } = Enquirer;

const program = new Command();

const categoryQuestions = [
    {
        type: "autocomplete",
        name: "category",
        message: "Category",
        choices: categories,
    },
];

const orderQuestions = [
    ...categoryQuestions,
    {
        type: "input",
        name: "id",
        message: "ID",
    },
    {
        type: "input",
        name: "name",
        message: "Name",
    },
    {
        type: "input",
        name: "amount",
        message: "Amount",
    },
    {
        type: "input",
        name: "info",
        message: "Info",
    }
]

export const promptListIds = async () => {
    const { category } = await prompt(categoryQuestions);
    return listCategoryItems(category);
};
// await promptListIds()

export const promptAddOrder = async () => {
    const { category, id, name, amount, info } = await prompt(orderQuestions);
    return add(category, id, name, amount, info);
};

const updateQuestions = [
    {
        type: "input",
        name: "id",
        message: "ID",
    },
    {
        type: "input",
        name: "amount",
        message: "Amount",
    },
];

export const promptUpdateOrder = async () => {
    const { id, amount } = await prompt(updateQuestions);
    return update(id, amount);
};

const commandsList = ["add", "update", "list", "list by ID's", "help", "exit"];
const commandsQuestions = [
    {
        type: "autocomplete",
        name: "command",
        message: "Command",
        choices: commandsList,
    },
];

export const promptCommand = async () => {
    const { command } = await prompt(commandsQuestions);
    return command;
}

export const interactiveApp = async (cmd) => {
    log(displayText(`Back office for my app`));
    log(displayInfo(`Interactive Mode`));
    try {
        const command = cmd ?? await promptCommand();
        switch (command) {
            case "add":
                log(displayInfo(`Add Order`));
                await promptAddOrder();
                return interactiveApp();
            case "update":
                log(displayInfo(`Update Order`));
                await promptUpdateOrder();
                return interactiveApp();
            case "list":
                log(displayInfo(`List categories`));
                listCategories();
                return interactiveApp();
            case "list by ID's":
                log(displayInfo(`List category Items`));
                await promptListIds();
                return interactiveApp();
            case "help":
                program.help();
            case "exit":
                process.exit(0);
        }
    } catch (err) {
        log(err);
        process.exit(1);
    }
};
await interactiveApp()