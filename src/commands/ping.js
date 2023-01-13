const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    interaction.reply("pong");
}

const definition = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Donne pong");

module.exports = {
    onTrigger,
    definition,
};
