import { got } from "got";
import { displayAmount, displayCategory, displayID, displayInfo, displayKey, displayName, displayRRP, displaySuccess, displayText, displayTimestamp } from "./displays.js";

const API = "http://localhost:3000";

export const categories = ["confectionery", "electronics"];

// log the usage of the command to the console
export const log = (msg) => {
    console.log(`\n${msg}\n`);
}

// log the error to the console
export const error = (msg) => {
    console.error(`\n${msg}\n`);
}

// update the order with the given ID
export async function update(id, amount) {
    log(`${displayTimestamp()}`)
    log(`${displayInfo(`Updating Order`)} ${displayID(id)} ${displayText("with amount")} ${displayAmount(amount)}`);
    try {
        if (isNaN(+amount)) {
            usage("Error: <AMOUNT> must be a number");
            process.exit(1);
        }

        // use GOT to make a POST request to the API
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount },
        });

        // log the result to the console
        log(`${displaySuccess()} ${displayText("Order")} ${displayID(id)} ${displayText("updated with amount")} ${displayAmount(amount)}`);
    } catch (err) {
        // if there is an error, log it ti the console and exit
        console.log(err.message);
        process.exit(1);
    }
}

// add a new order
export async function add(...args) {
    let [category, id, name, amount, info] = args;
    log(`${displayTimestamp()}`)
    log(`${displayInfo(`Request to add item to category`)} ${displayCategory(category)}`);
    log(`${displayText("Adding item")} ${displayID(id)} ${displayText("with amount")} ${displayAmount(`$${amount}`)}`);
    try {
        if (isNaN(+amount)) {
            error(`Error: <AMOUNT> must be a number`);
            process.exit(1);
        }

        await got.post(`${API}/${category}`, {
            json: {
                id,
                name,
                rrp: +amount,
                info: info + "",
            },
        });
        log(`${displaySuccess("Product Added! :")} ${displayID(id)} ${displayName(name)} ${displayText("has been added to the")} ${displayCategory(category)} ${displayText("category")}`);
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
}

// list the categories
export function listCategories() {
    log(displayTimestamp());
    log(displayInfo("Listing Categories"));
    try {
        log(displayText("Categories received from API: "))
        for (const cat of categories) log(displayCategory(cat));
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
}

// list the IDs for the given category
export async function listCategoryItems(category) {
    log(displayTimestamp());
    log(`${displayInfo(`List IDs`)}`);
    try {
        const result = await got(`${API}/${category}/`).json();
        log(`${displaySuccess("IDs received from API: ")}`);
        for (const item of result) {
            log(`\t ${displayKey("ID:")} \t ${displayID(item.id)} 
            ${displayKey(`Name:`)} \t ${displayName(item.name)} 
            ${displayKey("RRP:")} \t ${displayRRP(item.rrp)} 
            ${displayKey("Product Info:")} \t ${displayText(item.info)}`);
        }
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

