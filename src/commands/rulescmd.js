const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const permissions = require("../utils/permissions");

/**
 * Action when the command is triggered
 * @param {import("discord.js").ChatInputCommandInteraction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    if (permissions.canCommandRun(interaction, permissions.levels.admin)) {
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":books: __**Règles**__ de Shinsetsu Kurabu *V3*")
            .setDescription(
                `**__Introduction__**
Bienvenue dans le serveur Shinsetsu Kurabu. Avant de bien vous installer, veuillez lire les règles pour éviter de vous confronter avec des surprises. Toute mise à jour des règles sera annoncée.`
            )
            .addFields(
                {
                    name: "**__Chapitre I :__ le textuel**",
                    value: `1. Toutes sortes d'insultes, de diffamations, de discriminations, de racismes sur tous les salons textuels seront bloquées par l'automod ou supprimées par la modération et est sanctionnable
2. Tout manque de respect, insultes, publicités en message privé peut être bannissable (si vous en recevez, n'hésitez surtout pas à contacter la modération qui s'occupera de la situation)
3. Les personnes participantes à un raid spamm seront bannis.
4. Le spamming est non toléré.
5. Le non-respect abusif des thèmes de salons, peut entraver une sanction`,
                },
                {
                    name: "**__Chapitre II :__ le vocal**",
                    value: `1. Les insultes, les diffamations, les discriminations de tout genre, les racismes, entraîneront définitivement un bannissement
2. Les soundboards sont autorisés, seulement s'ils sont soutenables et respectueux des oreilles de tout le monde`,
                },
                {
                    name: "**__Chapitre III :__ les autres règles**",
                    value: `1. L'administration se réserve le droit de révises ces règles afin de les modifier ou d'en rajouter dans le futur, c'est-à-dire : faites attention
2. Toute forme de publicité est interdite, on vous a prévenu
3. Commencez pas à être casse-couilles (démerdez-vous avec cette info)
4. Si vous trouvez par chance une Fanny Shiny, veuillez immédiatement contacter les forces de l'ordre.`,
                }
            );

        interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });
    }
}

const definition = new SlashCommandBuilder()
    .setName("rulescmd")
    .setDescription("rules");

module.exports = {
    onTrigger,
    definition,
};
