const constantIDs = require("../constants/ids");
const { client, options } = require("../client");

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
    "rulescmd",
    "shop",
    "stats",
    "test",
    "tirage",
    "voiceslead",
    "vote",
    "xplead",
];

/**
 * Call the command of the interaction
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function callCommand(interaction) {
    if (interaction.isChatInputCommand() && commands.includes(interaction.commandName)) {
        require(`./${interaction.commandName}`).onTrigger(interaction);
    } else if (interaction.isSelectMenu()) {
        let path = interaction.customId.split("/");
        if (path[0] === "cmd") {
            require(`./${path[1]}`).onSelectMenu(interaction, path);
        }
    }
}

/**
 * Reset all commands on the current guild
 */
function resetCommands() {
    if (options.resetCommands) {

        console.log("Resetting slash commands...");

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
