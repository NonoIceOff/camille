const { MessageType, EmbedBuilder, Message } = require("discord.js");

/**
 * Detect if `message` is a bump and take action of
 * @param {Message} [message] Message
 */
function bump(message) {
    // TODO: Rewrite with DB
    if (message.type === MessageType.ChatInputCommand && message.interaction.commandName == "bump") {
        const user = message.interaction.user;
        message.channel.lastMessage.delete();
        user.addBump(1);
        user.addXP(150);
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":flashlight:   __**Bump effectué !**__")
            .setDescription(
                `***Merci <@${user.id}> pour le bump***, il a bien été comptabilisé au classement des bumps *(/bumplead)*. Vous contribuez au développement du serveur !\nVous avez gagné **150 xp** !`
            );
        message.channel.send({ embeds: [embed] });
    }
}

module.exports = {
    bump
};