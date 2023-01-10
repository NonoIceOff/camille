const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
function trigger(interaction) {
    interaction.reply("pong");
}

const definition = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Donne pong");

module.exports = {
    trigger,
    definition,
};
