import { got } from "got";

const API = "http://localhost:3000";
const categories = ["confectionery", "electronics"];

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
    usage(`Updating order ${id} with amount ${amount}`);
    try {
        if(isNaN(+amount)) {
            usage("Error: <AMOUNT> must be a number");
            process.exit(1);
        }

        // use GOT to make a POST request to the API
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount },
        });

        // log the result to the console
        usage(`Order ${id} updated with amount ${amount}`);
    } catch (err) {
        // if there is an error, log it ti the console and exit
        console.log(err.message);
        process.exit(1);
    }
}

// add a new order
export async function add(...args) {
    let [category, id, name, amount, info] = args;
    log(`Adding item ${id} with amount ${amount}`);
    try {
        if(isNaN(+amount)) {
            error(`Error: <AMOUNT> must be a number`);
            process.exit(1);
        }

        await got.post(`${API}/${category}`, {
            json: {
                id,
                name,
                rrp: +amount,
                info: info.join(" "),
            },
        });
        log(`Item "${id}:${name}" has been added to the ${category} category`);
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
}

// list the categories
export function listCategories() {
    log("Listing categories");
    try {
        for (const cat of categories) log(cat);
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
}

// list the IDs for the given category
export async function listCategoryItems(category) {
    log(`Listing IDs for category ${category}`);
    try {
        const result = await got(`${API}/${category}/`).json();
        for(const item of result) {
            log(`${item.id}: ${item.name} - $${item.rrp}\n Product Info: \t${item.info}`);
        }
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
}

