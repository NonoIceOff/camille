// TODO: Rewrite entire game

/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 * @example
 * onButton(interaction,path)
 */
 function onButton(interaction,path) {
    if (interaction.customId === "jp_rematch") {
        game_jp(interaction.user);
    }
}