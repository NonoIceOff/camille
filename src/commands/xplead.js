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
        editLeaderboard(interaction,userValuesName.XP,1);
    } else {
        editLeaderboard(interaction,userValuesName.XP,interaction.options.getInteger("page"));
    }
}

const definition = new SlashCommandBuilder()
    .setName("xplead")
    .setDescription("Classement des personnes en xp.")
    .addIntegerOption((result) =>
        result.setName("page").setDescription("Page").setMinValue(1)
    );

module.exports = {
    onTrigger,
    definition,
};
