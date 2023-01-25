const { User } = require("discord.js");

const db = require("../data/db");
const inventoryValuesName = require("../data/inventoryValuesName");
const grades = require("./grades");

class UserItem {
    #user;
    #itemId;
    #quantity;
    #expireDate;

    constructor(user, item) {
        this.#user = user;
        this.#itemId = item.item;
        this.#quantity = item.quantity ?? 0;
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

    async fetch() {
        const newData = await this.#user.getItem(this.#itemId);
        this.#quantity = newData.quantity;
        this.#expireDate = newData.expireDate;
    }

    init() {
        if (this.#itemId >= 0 && this.#itemId <= 2) grades.initGrade(this);

    }
}

module.exports = UserItem;
