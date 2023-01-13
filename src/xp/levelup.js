const { User } = require("discord.js");
const { options, client } = require("../client");
const constantIDs = require("../constants/ids");
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
    
    client.guilds.cache
    .get(constantIDs.workingGuild[+options.test])
    .channels.cache.get(constantIDs.channels.bot[+options.test])
    .send(
        `<@${user.id}> tu es passé au **NIVEAU ${level}**`
    );
}

module.exports = {
    sendLevelupMessage,
}