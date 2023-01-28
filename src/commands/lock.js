const {
    Role,
    PermissionFlagsBits,
    SlashCommandBuilder,
} = require("discord.js");
const permissions = require("../utils/permissions");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (permissions.canCommandRun(interaction, permissions.levels.admin)) {
        /**
         * @type {Role}
         */
        let role = interaction.guild.roles.cache.find(
            (r) => r.name === "@everyone"
        );
        if (
            interaction.channel.permissionOverwrites.cache
                .get(role.id)
                .deny.has(PermissionFlagsBits.SendMessages)
        ) {
            interaction.channel.permissionOverwrites.edit(role.id, {
                SendMessages: true,
            });
            interaction.channel.send("**Salon dévérouillé**");
        } else {
            interaction.channel.permissionOverwrites.edit(role.id, {
                SendMessages: false,
            });
            interaction.channel.send("**Salon vérouillé**");
        }
        interaction.reply("En attente...");
        await interaction.deleteReply();
    }
}

const definition = new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locker un salon");

module.exports = {
    onTrigger,
    definition,
};
