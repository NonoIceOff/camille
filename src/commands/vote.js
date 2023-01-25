const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { options, client } = require("../client");
const constantIDs = require("../constants/ids");
const db = require("../data/db");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    if (
        interaction.channel ==
        client.channels.cache.get(constantIDs.channels.bot[+options.test])
    ) {
        const maxVotes = interaction.member.roles.cache.has(
            constantIDs.roles.dreamTeamPlus[+options.test]
        )
            ? 2
            : 1;

        const votesCount = await db.getUserVoteCount(interaction.user.id);
        if (new Date().getDate() === 1) {
            if (votesCount < maxVotes) {
                const voted = interaction.options.getUser("member");

                if (!voted) return;

                db.registerVote(interaction.user.id, voted.id);

                const embed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(":ballot_box:  __**Vote comptabilisé !**__")
                    .setDescription(
                        `Merci ${
                            interaction.user
                        } pour ton vote, il a bien été comptabilisé.
${
    votesCount + 1 < maxVotes
        ? `*Il vous reste ${maxVotes - votesCount} vote.*`
        : ":warning: *Il ne vous reste plus aucun vote.*"
}`
                    );
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            } else {
                const embed = new EmbedBuilder()
                    .setColor(10038562)
                    .setTitle(":warning:  __**Vote non comptabilisé.**__")
                    .setDescription("Vous avez déja épuisé tous vos votes.");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor(10038562)
                .setTitle(":warning:  __**Vote non comptabilisé.**__")
                .setDescription("Les votes ne sont pas ouverts actuellement.");
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    } else {
        interaction.reply({
            content: "Mauvais salon. Dommage.",
            ephemeral: true,
        });
    }
}

const definition = new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Voter pour quelqu'un")
    .addUserOption((msgid) =>
        msgid
            .setName("member")
            .setDescription("Membre à qui vous lui donnez votre voie.")
            .setRequired(true)
    );

module.exports = {
    onTrigger,
    definition,
};
