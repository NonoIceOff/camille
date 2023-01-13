const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
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
    onTrigger,
    definition,
};
