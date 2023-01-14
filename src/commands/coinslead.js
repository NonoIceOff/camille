const { SlashCommandBuilder } = require("@discordjs/builders");

const {editLeaderboard} = require("../misc/leaderboard");
const userValuesName = require("../data/constants/userValuesName");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    await interaction.reply("Je travaille dessus ...");
    if (interaction.options.getInteger("page") == null) {
        editLeaderboard(interaction,userValuesName.coin,1);
    } else {
        editLeaderboard(interaction,userValuesName.coin,interaction.options.getInteger("page"));
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
