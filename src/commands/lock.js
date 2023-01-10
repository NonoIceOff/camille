const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(adminrole.id) === true) {
        let role = interaction.guild.roles.cache.find(
            (r) => r.name === "@everyone"
        );
        if (interaction.options.getBoolean("status") == true) {
            interaction.channel.permissionOverwrites.edit(role.id, {
                SendMessages: false,
            });
            //interaction.reply("**Salon vérouillé**");
            interaction.channel.send("**Salon vérouillé**");
        } else {
            interaction.channel.permissionOverwrites.edit(role.id, {
                SendMessages: true,
            });
            //interaction.reply("**Salon dévérouilllé**");
            interaction.channel.send("**Salon dévérouillé**");
        }
        interaction.reply("En attente...");
        await interaction.deleteReply();
    } else {
        interaction.reply(
            "Vous n'avez pas le rôle **" +
                adminrole.name +
                "** pour executer cette commande."
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
    trigger,
    definition,
};
