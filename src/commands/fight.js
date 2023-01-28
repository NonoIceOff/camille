const { SlashCommandBuilder } = require("discord.js");

const permissions = require("../utils/permissions");
const { editSettingsPanel } = require("../misc/fight");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (permissions.canCommandRun(interaction, permissions.levels.admin)) {
        interaction.reply(
            "Veuillez regarder vos MP pour paramétrer la prochaine saison"
        );
        const message = await interaction.user.send({
            content: "Je travaille dessus ...",
        });
        editSettingsPanel(message);
    }
}

const definition = new SlashCommandBuilder()
    .setName("fight")
    .setDescription("Fight discord");

module.exports = {
    onTrigger,
    definition,
};
