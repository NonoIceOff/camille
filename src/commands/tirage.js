const { SlashCommandBuilder } = require("@discordjs/builders");

const db = require("../data/db");
const constantIDs = require("../constants/ids");
const { options, client } = require("../client");
const { EmbedBuilder } = require("discord.js");

/**
 * Action when the command is triggered
 * @param {import("discord.js").ChatInputCommandInteraction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (
        interaction.member.roles.cache.has(
            constantIDs.roles.admin[+options.test]
        )
    ) {
        const title = (interaction.options.getString("title") ?? "Quelque chose").substring(0,50);

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(`:moneybag: Tentez de gagner... **__${title}__**`)
            .setDescription("Tirage au sort dès que l'auteur réponde.");
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });
        message.react("💰");

        db.registerGiveaway(message.id,interaction.user.id,title)
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

    if (false)
        if (interaction.member.roles.cache.has(adminrole.id) === true) {
            let file = editJsonFile("./infos.json");
            var tiragesdico = file.get("tirages");
            const embed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle(
                    ":moneybag: Tentez de gagner... **__" +
                        interaction.options.getString("titre") +
                        "__**"
                )
                .setDescription("Tirage au sort dès que l'auteur réponde.");
            const message = await interaction.reply({
                embeds: [embed],
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
            .setName("title")
            .setDescription("Le titre du tirage au sort")
            .setRequired(true)
            .setMaxLength(50)
    );

module.exports = {
    onTrigger,
    definition,
};
