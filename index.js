const {} = require("./src/data/prototype/User");
const {} = require("./src/xp/prototype/User");
const {} = require("./src/inventory/prototype/User");
const {} = require("./src/inventory/shop/prototype/User");
const { init } = require("./src/client");
const {} = require("./src/events");
const db = require("./src/data/db");

const config = {
    test: false,
    resetCommands: false,
};
const args = process.argv.slice(2);

let noStart = false;

args.forEach((arg, i) => {
    switch (arg) {
        case "-t":
        case "--test":
            config.test = true;
            break;
        case "-r":
        case "--reset-commands":
            config.resetCommands = true;
            break;
        case "-h":
        case "--help":
            console.log(`Usage: node index [arguments]
            
Options:
-t, --test              Run the bot in test mode.
-r, --reset-commands    Reset bot's commands.`);
            noStart=true;
            break;
    }
});

if (!noStart) {
    init(config);
    db.update();
}
