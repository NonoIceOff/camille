const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        let file = editJsonFile("./infos.json");
        var tiragesdico = file.get("tirages");
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(
                ":moneybag: Tentez de gagner... **__" +
                    interaction.options.getString("titre") +
                    "__**"
            )
            .setDescription("Tirage au sort dès que l'auteur réponde.");
        const message = await interaction.reply({
            embeds: [exampleEmbed],
            fetchReply: true,
        });
        message.react("💰");
        tiragesdico[message.id] = {};
        tiragesdico[message.id]["author"] = interaction.user.id;
        tiragesdico[message.id]["present"] = interaction.options
            .getString("titre")
            .toString();
        file.set("tirages", tiragesdico);
        file.save();
    } else {
        interaction.reply(
            "Vous n'avez pas le rôle **" +
                adminrole.name +
                "** pour executer cette commande."
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("tirage")
    .setDescription("Lancer un tirage au sort")
    .addStringOption((titre) =>
        titre
            .setName("titre")
            .setDescription("Le titre du tirage au sort")
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
