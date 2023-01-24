const { User } = require("discord.js");

const db = require("../../data/db");
const inventoryValuesName = require("../../data/inventoryValuesName");
const UserItem = require("../userItem");

/**
 *
 * @param {number} itemId
 * @returns {UserItem>}
 */
User.prototype.getItem = async function (itemId, registerIfNull = true) {
    const user = this;
    return new Promise(async (resolve) => {
        const item = await db.getUserItem(user.id, itemId);
        if (!item && registerIfNull) {
            db.registerUserItem(user.id, itemId, 0, Date.now());
        } else {
            resolve(new UserItem(user, item));
        }
    });
};

/**
 *
 * @returns {Promise<UserItem[]>}
 */
User.prototype.getItems = async function () {
    const user = this;
    return new Promise(async (resolve) => {
        const items = await db.getUserItems(user.id);
        resolve(items.map((item) => new UserItem(user, item)));
    });
};
