const { Message } = require("discord.js");

const games = {
    power4: require("./power4"),
    fairPrice: require("./fairPrice"),
    rockPaperScissors: require("./rockPaperScissors"),
};

/**
 * Call the `onMessage` function for the current game of the message author.
 * @param {Message} [message] Message
 */
function onMessage(message) {
    if (!message.guild && !message.author.bot) {
        // TODO: Get current game from DB
        let currentGame = "";

        if (games[currentGame]) games[currentGame].onMessage();
    }
}

/**
 * Call the `onButton` and `onSelectMenu`
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onInteraction(interaction) {
    if (!interaction.guild && !interaction.isChatInputCommand()) {
        let path = interaction.customId.split("/");
        if (path[0] === "game") {
            // TODO: Get current game from DB
            let currentGame = "";

            if (games[currentGame]) {
                if (interaction.isButton()) {
                    games[currentGame].onButton(interaction, path);
                } else if (interaction.isSelectMenu()) {
                    games[currentGame].onSelectMenu(interaction, path);
                }
            }
        }
    }
}

module.exports = {
    onMessage,
    onInteraction,
};
