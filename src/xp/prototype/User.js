const { User } = require("discord.js");

const { addUserValue } = require("../../data/db");
const userValuesName = require("../../data/userValuesName");
const { xpToLevel } = require("../utils");
const { sendLevelupMessage } = require("../levelup");

function init() {
    User.prototype.addXP = async function (xp, giveCoin = true) {
        let currentXp = await this.getXP();
        addUserValue(this.id, userValuesName.XP, xp);

        if (giveCoin) this.addCoin(xp / 10);

        if (
            Math.floor(xpToLevel(currentXp)) <
            Math.floor(xpToLevel(currentXp + xp))
        ) {
            sendLevelupMessage(this, Math.floor(xpToLevel(currentXp + xp)));
        }
    };
}

module.exports = { init };
