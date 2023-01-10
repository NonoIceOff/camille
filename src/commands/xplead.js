const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // TODO: Make it working
    await interaction.reply("Je travaille dessus ...");
    if (interaction.options.getInteger("page") == null) {
        leads(1, interaction, "xp_lead");
    } else {
        leads(interaction.options.getInteger("page"), interaction, "xp_lead");
    }
}

const definition = new SlashCommandBuilder()
    .setName("xplead")
    .setDescription("Classement des personnes en xp.")
    .addIntegerOption((result) =>
        result.setName("page").setDescription("Page").setMinValue(1)
    );

module.exports = {
    trigger,
    definition,
};
