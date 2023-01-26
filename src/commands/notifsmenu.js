const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

var constantIDs = require("../constants/ids");
const { options, client } = require("../client");
const path = require("path");

/**
 * Action when the command is triggered
 * @param {import("discord.js").ChatInputCommandInteraction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (
        interaction.member.roles.cache.has(
            constantIDs.roles.admin[+options.test]
        )
    ) {
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":bell: **__Sélection des notifications__**")
            .setDescription(`
📊 **Sondages**    *(Ne pas louper les sondages du serveur)*
🔴 **Vidéos**    *(Ne pas louper les vidéos)*
🏆 **Evènements**    *(Ne pas louper les évents organisés sur le serveur)*
🍺 **Shorts**    *(Ne pas louper les vidéos courtes)*`);
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });

        message.react("📊");
        message.react("🔴");
        message.react("🏆");
        message.react("🍺");

        constantIDs.messages.notifsRoleMenu[+options.test] = message.id;
        fs.writeFileSync(path.join(process.cwd(),"src/constants/ids.json"),JSON.stringify(constantIDs));
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
    .setName("notifsmenu")
    .setDescription("Message de sélection de notifications");

module.exports = {
    onTrigger,
    definition,
};
