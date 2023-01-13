const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":books: __**Règles**__ de Shinsetsu Kurabu *V3*")
            .setDescription(
                "**__Introduction__**\nBienvenue dans le serveur Shinsetsu Kurabu. Avant de bien vous installer, veuillez lire les règles pour éviter de vous confronter avec des surprises. Toute mise à jour des règles sera annoncée."
            )
            .addFields(
                {
                    name: "**__Chapitre I :__ le textuel**",
                    value: "1. Toutes sortes d'insultes, de diffamations, de discriminations, de racismes sur tous les salons textuels seront bloquées par l'automod ou supprimées par la modération et est sanctionnable\n2. Tout manque de respect, insultes, publicités en message privé peut être bannissable (si vous en recevez, n'hésitez surtout pas à contacter la modération qui s'occupera de la situation)\n3. Les personnes participantes à un raid spamm seront bannis.\n4. Le spamming est non toléré.\n5. Le non-respect abusif des thèmes de salons, peut entraver une sanction",
                },
                {
                    name: "**__Chapitre II :__ le vocal**",
                    value: "1. Les insultes, les diffamations, les discriminations de tout genre, les racismes, entraîneront définitivement un bannissement\n2. Les soundboards sont autorisés, seulement s'ils sont soutenables et respectueux des oreilles de tout le monde",
                },
                {
                    name: "**__Chapitre III :__ les autres règles**",
                    value: "1. L'administration se réserve le droit de révises ces règles afin de les modifier ou d'en rajouter dans le futur, c'est-à-dire : faites attention\n2. Toute forme de publicité est interdite, on vous a prévenu\n3. Commencez pas à être casse-couilles (démerdez-vous avec cette info)\n4. Si vous trouvez par chance une Fanny Shiny, veuillez immédiatement contacter les forces de l'ordre.",
                }
            );

        interaction.reply({
            embeds: [exampleEmbed],
            fetchReply: true,
        });
    } else {
        interaction.reply(
            "Vous n'avez pas le rôle **" +
                adminrole.name +
                "** pour executer cette commande."
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("rulescmd")
    .setDescription("rules");

module.exports = {
    onTrigger,
    definition,
};
