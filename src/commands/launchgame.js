const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // TODO: Make it working
    const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
            .setCustomId("jeu_selection")
            .setPlaceholder("Aucun jeu sélectionné")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Juste Prix",
                    description:
                        "5 essais pour trouver un nombre entre 1 et 100",
                    value: "jp",
                },
                {
                    label: "Pierre feuille ciseau",
                    description:
                        "En Best-Of 3. Celui qui a le meilleur score gagne.",
                    value: "pfc",
                },
                //{
                //	label: 'Puissance 4',
                //	description: 'Une grille, comme le puissance 4',
                //	value: 'p4',
                //},
            ])
    );

    await interaction.reply({
        content: "Selectionnez votre jeu :",
        components: [row],
    });
}

const definition = new SlashCommandBuilder()
    .setName("launchgame")
    .setDescription("Lancer un jeu");

module.exports = {
    trigger,
    definition,
};
