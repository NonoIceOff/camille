const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    // TODO: Make it working
    var text = "";
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        text = text + "**:badminton: __Admins commands__ :** \n";
        text = text + "**/lock** : *verrouiller ou dévérouiller un salon* \n";
        text = text + "**/rulescmd** : *afficher les règles* \n";
        text =
            text + "**/fight** : *panneau de contrôle pour FIGHT DISCORD* \n";
        text = text + "**/tirage** : *lancer un tirage au sort* \n";
    }
    if (interaction.member.roles.cache.has(dreamteam.id) === true) {
        text = text + "\n**:watermelon: __Dream Team commands__ :** \n";
        text = text + "**/poll** : *lancer un sondage* \n";
    }
    text = text + "\n**__Commands__ :** \n";
    text = text + "**/shop** : *voir le shop* \n";
    text =
        text + "**/launchgame** : *jouer à un jeu et mettre en jeu de l'xp* \n";
    text = text + "**/ping** : *affiche le ping* \n";
    text = text + "**/xplead** : *classement de l'xp du serveur* \n";
    text = text + "**/stats** : *affiche vos statistiques* \n";
    text = text + "**/coinslead** : *classement des coins du serveur* \n";
    text =
        text + "**/voiceslead** : *classement du temps de vocal du serveur* \n";
    text =
        text + "**/bumpslead** : *classement des bumps mensuels du serveur* \n";
    text =
        text +
        "**/fightlead** : *classement des gagnants de FIGHT DISCORD du serveur* \n";
    text = text + "**/hug** : *faire un câlin à quelqu'un* \n";
    text = text + "**/quests** : *voir ses quêtes* \n";
    text = text + "**/givecoins** : *donner des coins à quelqu'un* \n";

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("Commandes disponibles pour vous")
        .setDescription(text);

    interaction.reply({
        embeds: [exampleEmbed],
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
