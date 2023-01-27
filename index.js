const {} = require("./src/data/prototype/User");
const {} = require("./src/xp/prototype/User");
const {} = require('./src/inventory/prototype/User');
const {} = require('./src/inventory/shop/prototype/User');
const { init } = require("./src/client");
const {} = require("./src/events");
const db = require("./src/data/db");

init({ test: true, resetCommands:false });
db.update();