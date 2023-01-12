const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    interaction.reply(`Ton XP: ${await require("../data/db").getUserValue(interaction.user.id,require("../data/userValuesName").XP)}`);
}

const definition = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test");

module.exports = {
    trigger,
    definition,
};
