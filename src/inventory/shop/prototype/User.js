const { User } = require("discord.js");

const shopItems = require("../shopItems");
const db = require("../../../data/db");

/**
 * Init all shop-related prototypes.
 */
function init() {
    /**
     *
     * @param {number} itemId
     * @param {number} quantity
     */
    User.prototype.buyItem = async function (itemId, quantity = 1) {
        if (shopItems[itemId].price * quantity <= (await this.getCoin())) {
            this.addCoin(shopItems[itemId].price * quantity * -1);

            db.registerUserPurchase(this.id, itemId, quantity, Date.now());

            await this.giveItem(itemId, quantity);

            return 0;
        }
        return 1;
    };
}

module.exports = { init };
