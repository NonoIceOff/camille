const { Role } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const constantIDs = require("../constants/ids");
const { options, client } = require("../client");


/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(constantIDs.roles.admin[+options.test])) {
        /**
         * @type {Role}
         */
        let role = interaction.guild.roles.cache.find(
            (r) => r.name === "@everyone"
        );
        if (interaction.options.getBoolean("status") == true) {
            interaction.channel.permissionOverwrites.edit(role.id, {
                SendMessages: false,
            });
            interaction.channel.send("**Salon vérouillé**");
        } else {
            interaction.channel.permissionOverwrites.edit(role.id, {
                SendMessages: true,
            });
            interaction.channel.send("**Salon dévérouillé**");
        }
        interaction.reply("En attente...");
        await interaction.deleteReply();
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
    .setName("lock")
    .setDescription("Locker un salon")
    .addBooleanOption((choice) =>
        choice.setName("status").setDescription("Activé ou désactivé")
    );

module.exports = {
    onTrigger,
    definition,
};
