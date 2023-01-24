const { User } = require("discord.js");

const shopItems = require("../shopItems");
const db = require("../../../data/db");
const UserItem = require("../../userItem");

/**
 * 
 * @param {number} itemId 
 * @param {number} quantity 
 */
User.prototype.buyItem = async function(itemId,quantity) {
    if (shopItems[itemId].price * quantity <= await this.getCoin()) {
        this.addCoin(shopItems[itemId].price * quantity * -1);

        db.registerUserPurchase(this.id,itemId,quantity,Date.now());
        /**
         * @type {UserItem}
         */
        const item = await this.getItem(itemId);
        const baseQuantity = item.quantity;
        item.quantity+=quantity;

        if (baseQuantity === 0) {
            item.init()
        }
        return 0;
    }
    return 1;
};