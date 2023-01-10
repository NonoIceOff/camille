const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // TODO: Make it working
    await interaction.reply("Je travaille dessus ...");
    if (interaction.options.getInteger("page") == null) {
        leads(1, interaction, "xp_lead");
    } else {
        leads(interaction.options.getInteger("page"), interaction, "xp_lead");
    }
}

/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 * @example
 * onButton(interaction,path)
 */
async function onButton(interaction, path) {
    // TODO: Rewrite with DB

    if (interaction.customId === "xplead_+") {
        xp_lead(2, interaction);
    }
    if (interaction.customId === "xplead_-") {
        xp_lead(1, interaction);
    }
}

const definition = new SlashCommandBuilder()
    .setName("xplead")
    .setDescription("Classement des personnes en xp.")
    .addIntegerOption((result) =>
        result.setName("page").setDescription("Page").setMinValue(1)
    );

module.exports = {
    trigger,
    definition,
    onButton,
};
