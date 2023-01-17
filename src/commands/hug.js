const { User } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const { client } = require("../client");
/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    /**
     * @type {User}
     */
    var member = interaction.options.getUser("member");
    if (member != interaction.user && member.id != client.user.id) {
        await interaction.reply(
            `__**<@${interaction.user.id}> fait un câlin**__ à <@${member.id}> *(c'est mewgnon)*`
        );
    } else if (member == interaction.user) {
        await interaction.reply(
            `__**<@${interaction.user.id}> se fait un câlin**__ à... lui-même *(ok...)*`
        );
    } else {
        await interaction.reply(
            `__**<@${interaction.user.id}> me fait un câlin.**__ *(tout le monde me fait des câlins ? faut croire...)*`
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
            .setName("member")
            .setDescription("A qui voulez-vous faire un câlin ?")
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
