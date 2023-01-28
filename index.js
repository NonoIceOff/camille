const dataPrototype = require("./src/data/prototype/User");
const xpPrototype = require("./src/xp/prototype/User");
const inventoryPrototype = require("./src/inventory/prototype/User");
const shopPrototype = require("./src/inventory/shop/prototype/User");
const events = require("./src/events");
const client = require("./src/client");
const db = require("./src/data/db");

function main() {
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
-r, --reset-commands    Reset bot's commands.
-h, --help              Show this message.`);
                noStart = true;
                break;
        }
    });

    if (!noStart) {
        dataPrototype.init();
        xpPrototype.init();
        inventoryPrototype.init();
        shopPrototype.init();
        events.init();
        client.init(config);
        db.update();
    }
}
main();
