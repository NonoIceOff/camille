const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

const { toTimeFormat } = require("../utils/date");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(
            ":desktop:  __**Statistiques de " +
                interaction.member.displayName +
                "**__"
        )
        .setDescription("Toutes vos statisques, au même endroit, c'est ICI.")
        .addFields(
            {
                name: "Niveau :",
                // TODO: Add level display
                value: `**{level}** ({levelXp}/{levelXpToLevelup}) // TEMP: ${await interaction.user.getXP()}XP`,
                inline: true,
            },
            {
                name: "Monnaie :",
                value: `**${
                    Math.floor((await interaction.user.getCoin()) * 100) / 100
                }** :coin:`,
                inline: true,
            },
            {
                name: "Temps en vocal :",
                value: `**${toTimeFormat(
                    await interaction.user.getVoice(),
                    true
                )}**`,
                inline: true,
            },
            {
                name: "Bumps (all time) :",
                value: `**${await interaction.user.getBump()}**`,
                inline: true,
            },
            {
                name: "Bumps (ce mois-ci) :",
                value: `**${await interaction.user.getMonthlyBump()}**`,
                inline: true,
            }
        );
    interaction.reply({ embeds: [exampleEmbed] });
}

const definition = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Donne vos stats sur la monnaie, les niveaux");

module.exports = {
    onTrigger,
    definition,
};
