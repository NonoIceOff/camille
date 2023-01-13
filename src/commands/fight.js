const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
 function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        let file = editJsonFile("./fight.json");
        var fightdico = file.get("Saisons");
        if (!fightdico[fightdico["Number"].toString()]) {
            fightdico[fightdico["Number"].toString()] = {
                Joueurs: 8,
                ManchesQ: 3,
                Victoire: "Points",
            };
        }
        file.set("Saisons", fightdico);
        file.save();
        interaction.reply(
            "Veuillez regarder vos MP pour paramétrer la prochaine saison"
        );

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(
                "**Informations de la saison " +
                    fightdico["Number"].toString() +
                    " de Fight Discord**"
            )
            .setDescription(
                "*Les joueurs manquants seront remplacés par des IA. Le gagnant de la saison gagne.*"
            )
            .addFields(
                {
                    name:
                        "**JOUEURS :** " +
                        fightdico[fightdico["Number"].toString()][
                            "Joueurs"
                        ].toString(),
                    value: "4, 8, 16 ou 32",
                },
                {
                    name:
                        "**MANCHES QUALIFICATIONS :** " +
                        fightdico[fightdico["Number"].toString()][
                            "ManchesQ"
                        ].toString(),
                    value: "3 ou 5",
                },
                {
                    name:
                        "**CONDITION VICTOIRE :** " +
                        fightdico[fightdico["Number"].toString()][
                            "Victoire"
                        ],
                    value: "Points ou Kills",
                }
            );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("fight_players")
                    .setLabel("JOUEURS")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("fight_manches")
                    .setLabel("MANCHES Q")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("fight_victoire")
                    .setLabel("VICTOIRE")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("fight_launch")
                    .setLabel("⚔️ Lancer")
                    .setStyle(ButtonStyle.Danger)
            );
        interaction.user.send({
            embeds: [embed],
            components: [row],
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
    .setName("fight")
    .setDescription("Fight discord");

module.exports = {
    onTrigger, definition,
};
