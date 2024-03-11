#!/usr/bin/env node

import got from "got";

const API = "http://localhost:3000";

const usage = (msg = "Back office for my app") => {
    console.log(`\n${msg}\n`);
    console.log("Usage: cmd <ID> <AMOUNT>");
};

// get arguments from the command line
const argv = process.argv.slice(2);
if(argv.length < 2) {
    usage();
    process.exit(1);
}

// deconstruct the arguments into variables
const [argID, argAmount] = argv;

// check if the amount is a number
const amount = parseInt(argAmount);

// if the amount is not a number, show the usage and exit
if(isNaN(amount)) {
    usage("Error: <AMOUNT> must be a number");
    process.exit(1);
}

// update the order with the given ID
try {
    // use GOT to make a POST request to the API
    await got.post(`${API}/orders/${argID}`, {
        json: { amount },
    });

    // log the resut to the console
    console.log(`Order ${argID} updated with amount ${amount}`);
} catch(err) {
    // if there is an error, log it to the console and exit
    console.log(err.message);
    process.exit(1);
}