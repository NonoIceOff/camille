// TODO: Rewrite entire game

/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 * @example
 * onButton(interaction,path)
 */
 function onButton(interaction,path) {

    if (interaction.customId === "pierre_button") {
        game_pfc(interaction.user, 1);
        interaction.deferUpdate();
    }
    if (interaction.customId === "feuille_button") {
        game_pfc(interaction.user, 2);
        interaction.deferUpdate();
    }
    if (interaction.customId === "ciseaux_button") {
        game_pfc(interaction.user, 3);
        interaction.deferUpdate();
    }
    if (interaction.customId === "pfc_rematch") {
        game_pfc(interaction.user, 1);
    }
}