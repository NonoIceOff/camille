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
        leads(1, interaction, "bumps_lead");
    } else {
        leads(
            interaction.options.getInteger("page"),
            interaction,
            "bumps_lead"
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("bumpslead")
    .setDescription("Classement des bumps.")
    .addIntegerOption((result) =>
        result.setName("page").setDescription("Page").setMinValue(1)
    );

module.exports = {
    trigger,
    definition,
};
