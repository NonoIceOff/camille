const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    var membre = interaction.options.getUser("membre");
    if (membre != interaction.user && !membre.bot) {
        await interaction.reply(
            "__**<@" +
                interaction.user +
                "> fait un câlin**__ à <@" +
                membre +
                "> *(c'est mewgnon)*"
        );
    } else if (membre == interaction.user) {
        await interaction.reply(
            "__**<@" +
                interaction.user +
                "> se fait un câlin**__ à... lui-même *(ok...)*"
        );
    } else {
        await interaction.reply(
            "__**<@" +
                interaction.user +
                "> me fait un câlin.**__ *(tout le monde me fait des câlins ? faut croire...)*"
        );
    }
    interaction.channel.send(
        "https://media.tenor.com/iwKHdW8wi1IAAAAC/tohka-yatogami.gif"
    );
}

const definition = new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Vous voulez un câlin ?")
    .addUserOption((msgid) =>
        msgid
            .setName("membre")
            .setDescription("A qui voulez-vous faire un câlin ?")
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
