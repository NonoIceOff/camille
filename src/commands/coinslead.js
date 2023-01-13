const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    await interaction.reply("Je travaille dessus ...");
    if (interaction.options.getInteger("page") == null) {
        leads(1, interaction, "coins_lead");
        //coins_lead(1,interaction)
    } else {
        leads(
            interaction.options.getInteger("page"),
            interaction,
            "coins_lead"
        );
        //coins_lead(interaction.options.getInteger('page'),interaction)
    }
}

const definition = new SlashCommandBuilder()
    .setName("coinslead")
    .setDescription("Classement des personnes les plus riches")
    .addIntegerOption((result) =>
        result.setName("page").setDescription("Page").setMinValue(1)
    );

module.exports = {
    onTrigger,
    definition,
};
