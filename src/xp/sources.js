const { Message } = require("discord.js");

const { options } = require("../client");
const constantIDs = require("../constants/ids");


/**
 * Detect if `message` is eligible to give XP to the user and give it.
 * @param {Message} [message] Message
 * @example
 * fromMessage(message)
 */
function fromMessage(message) {
    if (!message.author.bot) {
        if (message.channelId != constantIDs.channels.bot[+options.test]) {
            //if(message.guildId == guild_id) {
            let file3 = editJsonFile("./infos.json");
            var membersdico = file3.get("members");
            if (!membersdico[message.author.id]) {
                membersdico[message.author.id] = {
                    xp_total: 0,
                    xp: 0,
                    niveau: 0,
                    esheep: 0,
                    bumpstotal: 0,
                };
            }
            file3.set("members", membersdico);
            file3.save();
            var gain_xp = 5 + Math.floor(Math.random() * 5) + 1;
            add_xp_to_user(message.author, gain_xp);
        }
    }
}

module.exports = {
    fromMessage,
};