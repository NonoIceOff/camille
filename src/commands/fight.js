const { SlashCommandBuilder } = require("@discordjs/builders");

const constantIDs = require("../constants/ids");
const { options, client } = require("../client");
const { editSettingsPanel } = require("../misc/fight");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (
        interaction.member.roles.cache.has(
            constantIDs.roles.admin[+options.test]
        )
    ) {
        interaction.reply(
            "Veuillez regarder vos MP pour paramétrer la prochaine saison"
        );
        const message = await interaction.user.send({
            content: "Je travaille dessus ...",
        });
        editSettingsPanel(message);
    } else {
        interaction.reply(
            `Vous n'avez pas le rôle **${
                client.guilds.cache
                    .get(constantIDs.workingGuild[+options.test])
                    .roles.cache.get(constantIDs.roles.admin[+options.test])
                    .name
            }** pour executer cette commande.`
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("fight")
    .setDescription("Fight discord");

module.exports = {
    onTrigger,
    definition,
};
