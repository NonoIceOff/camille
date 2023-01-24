const grades = require("./grades");
const db = require("../data/db");

async function init() {
    const items = await db.getUsersItems();
    const usersItems = {};

    items.forEach((item)=>{
        if (!usersItems[item.user_id]) {
            usersItems[item.user_id] = [];
        }
        usersItems[item.user_id][item.item] = item;
    });

    grades.initExpirations(usersItems);
}

module.exports = {
    init,
}