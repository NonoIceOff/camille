const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../data/db");
const permissions = require("../utils/permissions");

/**
 * Action when the command is triggered
 * @param {import("discord.js").ChatInputCommandInteraction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (permissions.canCommandRun(interaction, permissions.levels.admin)) {
        const title = (
            interaction.options.getString("title") ?? "Quelque chose"
        ).substring(0, 50);

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(`:moneybag: Tentez de gagner... **__${title}__**`)
            .setDescription("Tirage au sort dès que l'auteur réponde.");
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });
        message.react("💰");

        db.registerGiveaway(message.id, interaction.user.id, title);
    }
}

const definition = new SlashCommandBuilder()
    .setName("tirage")
    .setDescription("Lancer un tirage au sort")
    .addStringOption((titre) =>
        titre
            .setName("title")
            .setDescription("Le titre du tirage au sort")
            .setRequired(true)
            .setMaxLength(50)
    );

module.exports = {
    onTrigger,
    definition,
};
