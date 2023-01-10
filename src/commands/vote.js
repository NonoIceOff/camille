const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
function trigger(interaction) {
    // TODO: Make it working
    if (
        interaction.channel ==
        client.channels.cache.get(constantIDs.channels.bot[+options.test])
    ) {
        let file = editJsonFile("./infos.json");
        var membersdico = file.get("votes");
        var max_votes = 1;
        if (interaction.member.roles.cache.has(dreamteam.id) === true) {
            max_votes = 2;
        }
        if (!membersdico[interaction.options.getUser("membre").id]) {
            membersdico[interaction.options.getUser("membre").id] = 0;
        }
        if (!membersdico["voted"][interaction.user.id]) {
            membersdico["voted"][interaction.user.id] = 0;
        }
        var desc = "";
        if (max_votes - membersdico["voted"][interaction.user.id] - 1 > 0) {
            desc =
                "\n*Il vous reste " +
                (max_votes - membersdico["voted"][interaction.user.id] - 1) +
                " vote.*";
        } else {
            desc = "\n:warning: *Il ne vous reste plus aucun vote.*";
        }
        if (membersdico["voted"]["start"] === 1) {
            if (membersdico["voted"][interaction.user.id] < max_votes) {
                membersdico[interaction.options.getUser("membre").id] += 1;
                membersdico["voted"][interaction.user.id] += 1;
                file.set("votes", membersdico);
                file.save();

                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(":ballot_box:  __**Vote comptabilisé !**__")
                    .setDescription(
                        "Merci <@" +
                            interaction.user +
                            "> pour ton vote, il a bien été comptabilisé." +
                            desc
                    );
                //interaction.channel.permissionOverwrites
                //    .edit(interaction.user.id, { SendMessages: false});
                interaction.reply({
                    embeds: [exampleEmbed],
                });
            } else {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10038562)
                    .setTitle(":warning:  __**Vote non comptabilisé.**__")
                    .setDescription("Vous avez déja épuisé tous vos votes.");
                //interaction.channel.permissionOverwrites
                //    .edit(interaction.user.id, { SendMessages: false});
                interaction.reply({
                    embeds: [exampleEmbed],
                });
            }
        } else {
            const exampleEmbed = new EmbedBuilder()
                .setColor(10038562)
                .setTitle(":warning:  __**Vote non comptabilisé.**__")
                .setDescription("Les votes ne sont pas ouverts actuellement.");
            //interaction.channel.permissionOverwrites
            //    .edit(interaction.user.id, { SendMessages: false});
            interaction.reply({
                embeds: [exampleEmbed],
            });
        }
    } else {
        interaction.reply("Mauvais salon. Dommage.");
    }
}

const definition = new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Voter pour quelqu'un")
    .addUserOption((msgid) =>
        msgid
            .setName("membre")
            .setDescription("Membre à qui vous lui donnez votre voie.")
            .setRequired(true)
    );

module.exports = {
    trigger,
    definition,
};
