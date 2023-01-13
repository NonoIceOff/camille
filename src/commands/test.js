const { SlashCommandBuilder } = require("@discordjs/builders");
const { User } = require("../data/prototype/User");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    let oldXP = 0;//await interaction.user.getXP();
    interaction.user.addXP(5);
    interaction.reply(`Avant t'avais ${oldXP}XP mais maintenant t'en as ${await interaction.user.getXP()}`);
}

const definition = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test");

module.exports = {
    onTrigger,
    definition,
};
