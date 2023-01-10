const { MessageType, EmbedBuilder, Message } = require("discord.js");

/**
 * Detect if `message` is a bump and take action of
 * @param {Message} [message] Message
 * @example
 * bump(message)
 */
function bump(message) {
    // TODO: Rewrite with DB
    if (message.type === MessageType.ChatInputCommand && message.interaction.commandName == "bump") {
        var inter = message.interaction.user.id;
        var interuser = message.interaction.user;
        message.channel.lastMessage.delete();
        let file2 = editJsonFile("./infos.json");
        var bumpmember = file2.get("bump");
        var membersdico = file2.get("members");
        if (!membersdico[inter]) {
            membersdico[inter] = {
                xp_total: 0,
                xp: 0,
                niveau: 0,
                esheep: 0,
                bumpstotal: 0,
            };
        }
        bumpmember[inter] = bumpmember[inter] + 1;
        membersdico[inter]["bumpstotal"] = membersdico[inter]["bumpstotal"] + 1;
        file2.set("bump", bumpmember);
        file2.set("members", membersdico);
        file2.save();
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":flashlight:   __**Bump effectué !**__")
            .setDescription(
                "***Merci <@" +
                    inter +
                    "> pour le bump***, il a bien été comptabilisé au classement des bumps *(/bumplead)*. Vous contribuez au développement du serveur !\nVous avez gagné **150 xp** !"
            );
        message.channel.send({ embeds: [exampleEmbed] });
        add_xp_to_user(interuser, 150);
    }
}

module.exports = {
    bump
};