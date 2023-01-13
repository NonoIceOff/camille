const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

const constantIDs = require("../constants/ids");
const { options } = require("../client");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    var text =
        (interaction.member.roles.cache.has(
            constantIDs.roles.admin[+options.test]
        )
            ? `
**:badminton: __Admins commands__ :**
**/lock** : *verrouiller ou dévérouiller un salon*
**/rulescmd** : *afficher les règles*
**/fight** : *panneau de contrôle pour FIGHT DISCORD*
**/tirage** : *lancer un tirage au sort* \n\n`
            : "") +
        (interaction.member.roles.cache.has(
            constantIDs.roles.dreamTeam[+options.test]
        )
            ? `
**:watermelon: __Dream Team commands__ :**
**/poll** : *lancer un sondage* \n\n`
            : "") +
        `
**__Commands__ :**
**/shop** : *voir le shop*
**/launchgame** : *jouer à un jeu et mettre en jeu de l'xp*
**/ping** : *affiche le ping*
**/xplead** : *classement de l'xp du serveur*
**/stats** : *affiche vos statistiques*
**/coinslead** : *classement des coins du serveur*
**/voiceslead** : *classement du temps de vocal du serveur*
**/bumpslead** : *classement des bumps mensuels du serveur*
**/fightlead** : *classement des gagnants de FIGHT DISCORD du serveur*
**/hug** : *faire un câlin à quelqu'un*
**/quests** : *voir ses quêtes*
**/givecoins** : *donner des coins à quelqu'un*`;

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("Commandes disponibles pour vous")
        .setDescription(text);

    interaction.reply({
        embeds: [embed],
        fetchReply: true,
    });
}

const definition = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Commande d'aide");

module.exports = {
    onTrigger,
    definition,
};
