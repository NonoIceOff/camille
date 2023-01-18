const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, SelectMenuBuilder, SelectMenuInteraction } = require("discord.js");

const gamesCore = require("../games/core");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
            .setCustomId("cmd/launchgame")
            .setPlaceholder("Aucun jeu sélectionné")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Juste Prix",
                    description:
                        "5 essais pour trouver un nombre entre 1 et 100",
                    value: "fairPrice",
                },
                {
                    label: "Pierre feuille ciseau",
                    description:
                        "En Best-Of 3. Celui qui a le meilleur score gagne.",
                    value: "rockPaperScissors",
                },
                {
                	label: 'Puissance 4',
                	description: 'Une grille, comme le puissance 4',
                	value: 'power4',
                },
            ])
    );

    await interaction.reply({
        content: "Selectionnez votre jeu :",
        components: [row],
    });
}

/**
 * Triggered when something is selected in a select menu
 * @param {SelectMenuInteraction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 */
async function onSelectMenu(interaction,path) {
    gamesCore.init(interaction.user,interaction.values[0]);
    // TODO: Rewrite with DB
    if(false) {
    if (interaction.values[0] === "jp") {
        game_jp(interaction.user);
    }
    if (interaction.values[0] == "pfc") {
        game_pfc(interaction.user);
    }
    if (interaction.values[0] == "p4") {
        game_p4(interaction.user);
    }}
    interaction.deferUpdate();
}


const definition = new SlashCommandBuilder()
    .setName("launchgame")
    .setDescription("Lancer un jeu");

module.exports = {
    onTrigger,
    definition,
    onSelectMenu,
};
