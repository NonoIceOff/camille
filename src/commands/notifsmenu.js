const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":bell: **__Sélection des notifications__**")
            .setDescription(
                "📊 **Sondages**    *(Ne pas louper les sondages du serveur)*\n🔴 **Vidéos**    *(Ne pas louper les vidéos)*\n🏆 **Evènements**    *(Ne pas louper les évents organisés sur le serveur)*\n🍺 **Shorts**    *(Ne pas louper les vidéos courtes)*"
            );
        const message = await interaction.reply({
            embeds: [exampleEmbed],
            fetchReply: true,
        });

        message.react("📊");
        message.react("🔴");
        message.react("🏆");
        message.react("🍺");
    } else {
        interaction.reply(
            "Vous n'avez pas le rôle **" +
                adminrole.name +
                "** pour executer cette commande."
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("notifsmenu")
    .setDescription("Message de sélection de notifications");

module.exports = {
    trigger,
    definition,
};
