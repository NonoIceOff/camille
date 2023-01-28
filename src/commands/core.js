const { options } = require("../client");
const { constants } = require("../utils/clientConstants");

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
    //"quests", Disabled because not already implemented.
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
    if (
        interaction.isChatInputCommand() &&
        commands.includes(interaction.commandName)
    ) {
        require(`./${interaction.commandName}`).onTrigger(interaction);
        return;
    }
    let path = interaction.customId.split("/");
    if (path[0] === "cmd") {
        if (interaction.isModalSubmit()) {
            require(`./${path[1]}`).onModalSubmit(interaction, path);
        } else if (interaction.isButton()) {
            require(`./${path[1]}`).onButton(interaction, path);
        } else if (interaction.isSelectMenu()) {
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

        constants.workingGuild.commands.set(commands_definition);
    }
}

module.exports = {
    callCommand,
    resetCommands,
};
