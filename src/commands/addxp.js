const { SlashCommandBuilder } = require("discord.js");

const permissions = require("../utils/permissions");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    if (permissions.canCommandRun(interaction, permissions.levels.admin)) {
        var user = interaction.options.getUser("member");
        var amount = interaction.options.getInteger("amount");

        user.addXP(amount, false);
        interaction.reply(`**${user.username}** a été give de ${amount}xp.`);
    }
}

const definition = new SlashCommandBuilder()
    .setName("addxp")
    .setDescription("Ajouter de l'xp a un membre du serveur")
    .addUserOption((msgid) =>
        msgid
            .setName("member")
            .setDescription("Membre à qui vous voulez give de l'xp")
            .setRequired(true)
    )
    .addIntegerOption((result) =>
        result
            .setName("amount")
            .setDescription("Montant de l'xp à donner")
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
