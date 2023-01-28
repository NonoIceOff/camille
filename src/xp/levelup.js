const { User } = require("discord.js");
const { constants } = require("../utils/clientConstants");
const { xpToLevel } = require("./utils");

/**
 * Send a levelup message in the bot channel
 * @param {User} user
 * @param {number} level
 */
async function sendLevelupMessage(user, level = null) {
    if (!level) {
        level = Math.floor(xpToLevel(await user.getXP()));
    }

    constants.channels.bot.send(`${user} tu es passé au **NIVEAU ${level}**`);
}

module.exports = {
    sendLevelupMessage,
};
