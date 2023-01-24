const { User } = require("discord.js");

const db = require("../data/db");
const inventoryValuesName = require("../data/inventoryValuesName");

class UserItem {
    #user;
    #itemId;
    #quantity;
    #expireDate;

    constructor(user, item) {
        this.#user = user;
        this.#itemId = item.item;
        this.#quantity = item.quantity;
        this.#expireDate = item.expire_date;
    }

    /**
     * @returns {User}
     */
    get user() {
        return this.#user;
    }

    /**
     * @returns {number}
     */
    get itemId() {
        return this.#itemId;
    }

    /**
     * @returns {number}
     */
    get quantity() {
        return this.#quantity;
    }
    set quantity(value) {
        this.#quantity = value;
        db.setUserItemValue(
            this.user.id,
            this.itemId,
            inventoryValuesName.quantity,
            this.#quantity);
    }

    /**
     * @returns {number}
     */
    get expireDate() {
        return this.#expireDate;
    }
    set expireDate(value) {
        this.#expireDate = value;
        db.setUserItemValue(
            this.user.id,
            this.itemId,
            inventoryValuesName.expireDate,
            this.#expireDate);
    }

    init() {


    }
}

module.exports = UserItem;
