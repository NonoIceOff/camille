const { Message } = require("discord.js");

const games = {
    /*power4: require("./power4"),
    fairPrice: require("./fairPrice"),*/
}

/**
 * Call the `onMessage` function for the current game of the message author.
 * @param {Message} [message] Message
 * @example
 * onMessage(message)
 */
function onMessage(message) {
    if (!message.guild && !message.author.bot) {
        // TODO: Get current game from DB
        let currentGame = "";

        if (games[currentGame]) games[currentGame].onMessage();
    }
}

module.exports = {
    onMessage,
};