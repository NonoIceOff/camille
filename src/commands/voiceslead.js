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
        leads(1, interaction, "voices_lead");
        //voice_lead(1,interaction)
    } else {
        leads(
            interaction.options.getInteger("page"),
            interaction,
            "voices_lead"
        );
        //voice_lead(interaction.options.getInteger('page'),interaction)
    }
}

const definition = new SlashCommandBuilder()
    .setName("voiceslead")
    .setDescription("Classement des personnes en vocal.")
    .addIntegerOption((result) =>
        result.setName("page").setDescription("Page").setMinValue(1)
    );

module.exports = {
    trigger,
    definition,
};
