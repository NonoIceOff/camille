const { User } = require("discord.js");

const db = require("../../data/db");
const UserItem = require("../userItem");

function init() {
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
                await db.registerUserItem(user.id, itemId, 0, Date.now());
                resolve(await this.getItem(itemId, false));
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

    /**
     *
     * @param {number} itemId
     * @param {number} quantity
     */
    User.prototype.giveItem = async function (itemId, quantity = 1) {
        /**
         * @type {UserItem}
         */
        const item = await this.getItem(itemId);
        const baseQuantity = item.quantity;
        item.quantity += quantity;

        if (baseQuantity === 0) {
            item.init();
        }
    };
}

module.exports = { init };
