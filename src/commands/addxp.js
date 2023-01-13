const { SlashCommandBuilder } = require("@discordjs/builders");

const constantIDs = require("../constants/ids");
const { options, client } = require("../client");


/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    // TODO: Make it working
    if (
        interaction.member.roles.cache.has(
            constantIDs.roles.admin[+options.test]
        )
    ) {
        var user = interaction.options.getUser("member");
        var amount = interaction.options.getInteger("amount");

        user.addXP(amount);
        interaction.reply(`**${user.username}** a été give de ${amount}xp.`);
    } else {
        interaction.reply(
            `Vous n'avez pas le rôle **${
                client.guilds.cache
                    .get(constantIDs.workingGuild[+options.test])
                    .roles.cache.get(constantIDs.roles.admin[+options.test])
                    .name
            }** pour executer cette commande.`
        );
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
