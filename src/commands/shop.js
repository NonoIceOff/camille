const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
function trigger(interaction) {
    // TODO: Make it working
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("members");

    let file2 = editJsonFile("./shop.json");
    var shopdico = file2.get("Members");

    if (!shopdico[interaction.user.id]) {
        shopdico[interaction.user.id] = {
            Grades: [0, 0, 0],
        };
        file2.set("Members", shopdico);
        file2.save();
    }

    var coins = membersdico[interaction.user.id]["esheep"];
    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":barber: __Shop :__ ")
        .setDescription("Vous avez **" + coins.toString() + " :coin:**")
        .addFields(
            {
                name:
                    "__**Grade Dream Team**__ *(220:coin:/mois)* " +
                    shopdico[interaction.user.id]["Grades"][0] +
                    "x",
                value: "*- Création de sondages\n- Salon Dream Team exclusif\n- 1 mini-jeu en + disponible*",
            },
            {
                name:
                    "__**Grade Dream Team +**__ *(467:coin:/mois)* " +
                    shopdico[interaction.user.id]["Grades"][1] +
                    "x",
                value: "*- Tous les avantages de Dream Team\n- Création de sondages et d'évènements\n- Couleur du pseudo personalisable\n- Double vote de popularité\n- Salon exclu pour les Dream Team +*",
            },
            {
                name:
                    "__**Grade Super Dream Team**__ *(1182:coin:/mois)* " +
                    shopdico[interaction.user.id]["Grades"][2] +
                    "x",
                value: "*- Tous les avantages de Dream Team et Dream Team +\n- Renommer son pseudo\n- Salon exclu pour les Super Dream Team*",
            }
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("shop_dreamteam")
                .setLabel("🍉")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("shop_dreamteam+")
                .setLabel("🍉+")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("shop_superdreamteam")
                .setLabel("Super 🍉")
                .setStyle(ButtonStyle.Secondary)
        );
    interaction.user.send({
        embeds: [exampleEmbed],
        components: [row],
        fetchReply: true,
    });
    interaction.reply("Commande utilisée, veuillez regarder vos MP");
}

const definition = new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Commande d'achats");

module.exports = {
    trigger,
    definition,
};
