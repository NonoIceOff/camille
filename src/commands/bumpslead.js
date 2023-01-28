const { SlashCommandBuilder } = require("discord.js");

const { editLeaderboard } = require("../misc/leaderboard");
const userValuesName = require("../data/userValuesName");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    await interaction.reply("Je travaille dessus ...");
    if (interaction.options.getInteger("page") == null) {
        editLeaderboard(interaction, userValuesName.monthlyBump, 1);
    } else {
        editLeaderboard(
            interaction,
            userValuesName.monthlyBump,
            interaction.options.getInteger("page")
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
