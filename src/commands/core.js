const constantIDs = require("../constants/ids");
const { client, options } = require("../client");

/**
 * Call the command of the interaction
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * callCommand(interaction)
 */
function callCommand(interaction) {
    if (interaction.isChatInputCommand()) {
        require(`./${interaction.commandName}`).trigger(interaction);
    } else if (interaction.isSelectMenu()) {
        let path = interaction.customId.split("/");
        require(`./${path[0]}`).onSelectMenu(interaction,path);
    }
}

/**
 * Reset all commands on the current guild
 * @example
 * resetCommands()
 */
function resetCommands() {
    if (options.resetCommands) {
        const commands = [
            "addxp",
            "bumpslead",
            "coinslead",
            "fight",
            "fightlead",
            "help",
            "hug",
            "launchgame",
            "lock",
            "notifsmenu",
            "ping",
            "poll",
            "quests",
            "removexp",
            "rulescmd",
            "shop",
            "stats",
            "test",
            "tirage",
            "voiceslead",
            "vote",
            "xplead",
        ];

        const commands_definition = commands.map(
            (command) => require(`./${command}`).definition
        );

        client.guilds.cache
            .get(constantIDs.workingGuild[+options.test])
            .commands.set(commands_definition);
    }
}

module.exports = {
    callCommand,
    resetCommands,
};
