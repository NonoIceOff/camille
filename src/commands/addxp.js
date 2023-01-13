const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        var membre = interaction.options.getUser("membre");
        add_xp_to_user(membre, interaction.options.getInteger("montant"));
        interaction.reply(
            "**" +
                membre.username +
                "** a été give de " +
                interaction.options.getInteger("montant") +
                "xp."
        );
    } else {
        interaction.reply(
            "Vous n'avez pas le rôle **" +
                adminrole.name +
                "** pour executer cette commande."
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("addxp")
    .setDescription("Ajouter de l'xp a un membre du serveur")
    .addUserOption((msgid) =>
        msgid
            .setName("membre")
            .setDescription("Membre à qui vous voulez give de l'xp")
            .setRequired(true)
    )
    .addIntegerOption((result) =>
        result
            .setName("montant")
            .setDescription("Montant de l'xp à donner")
            .setMinValue(1)
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
