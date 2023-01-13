const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        let file = editJsonFile("./infos.json");
        var membersdico = file.get("members");
        var membre = interaction.options.getUser("membre");
        var montant = interaction.options.getInteger("montant");
        membersdico[membre.id]["xp"] =
            membersdico[membre.id]["xp"] -
            interaction.options.getInteger("montant");
        membersdico[membre.id]["xp_total"] =
            membersdico[membre.id]["xp_total"] - montant;
        while (membersdico[membre.id]["xp"] < 0) {
            membersdico[membre.id]["niveau"] -= 1;
            membersdico[membre.id]["xp"] =
                membersdico[membre.id]["xp"] +
                (5 * Math.pow(membersdico[membre.id]["niveau"], 2) +
                    50 * membersdico[membre.id]["niveau"] +
                    100);
        }

        file.set("members", membersdico);
        file.save();
        interaction.reply(
            "**" +
                membre.username +
                "** a été retiré de " +
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
    .setName("removexp")
    .setDescription("Retirer de l'xp a un membre du serveur")
    .addUserOption((msgid) =>
        msgid
            .setName("membre")
            .setDescription("Membre à qui vous voulez retirer de l'xp")
            .setRequired(true)
    )
    .addIntegerOption((result) =>
        result
            .setName("montant")
            .setDescription("Montant de l'xp à retirer")
            .setMinValue(1)
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
