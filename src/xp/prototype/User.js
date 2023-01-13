const { User } = require("discord.js");

const { getUserValue, setUserValue, addUserValue } = require("../../data/db");
const userValuesName = require("../../data/constants/userValuesName");
const { xpToLevel } = require("../utils");
const { sendLevelupMessage } = require("../levelup");

User.prototype.addXP = async function (xp) {
    let currentXp = await this.getXP();
    addUserValue(this.id, userValuesName.XP, xp);

    if (
        Math.floor(xpToLevel(currentXp)) < Math.floor(xpToLevel(currentXp + xp))
    ) {
        sendLevelupMessage(this, Math.floor(xpToLevel(currentXp + xp)));
    }
};
