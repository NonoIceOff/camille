const { EmbedBuilder } = require("discord.js");
const { runAtDate } = require("../utils/date");
const db = require("../data/db");
const itemIds = require("../inventory/itemIds");
const { constants } = require("../utils/clientConstants");

/**
 * Init votes timeouts.
 */
function initVotes() {
    const currentDate = new Date();
    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
        1
    );
    const stopDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (currentDate.getDate() >= 2 ? 1 : 0),
        2,
        1
    );

    runAtDate(startDate, sendVoteStart);
    runAtDate(stopDate, sendVoteStop);
}

/**
 * Send the votes starting message and reset old votes.
 */
async function sendVoteStart() {
    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":envelope:  __**Les votes du mois sont ouverts**__")
        .setDescription(
            `Les votes du mois sont ouverts, vous avez maintenant 24h pour élire le meilleur membre du serveur.\nL'élu recevra le rôle **${constants.roles.superDreamTeam.name}**`
        );

    db.resetVotes();

    await constants.channels.bot.send({ embeds: [embed] });

    const currentDate = new Date();
    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
        1
    );

    runAtDate(startDate, sendVoteStart);
}

/**
 * Send the vote closing message with a leaderboard of votes and give the 30-day Super Dream Team Pass.  
 */
async function sendVoteStop() {
    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(
            ":envelope:  __**Fermeture des votes, voici les résultats :**__"
        );

    let leaderboard = (await db.getVotesCount()).sort(
        (a, b) => b.votes - a.votes
    );

    let fieldsLeaderboard = await Promise.all(
        leaderboard.map(async (place, i) => {
            const guildMember = await constants.workingGuild.members.fetch(
                place.user
            );
            let username = `<!${place.user}>`;
            if (guildMember)
                username = guildMember.nickname ?? guildMember.user.username;

            return {
                name: `${
                    i === 0 ? ":trophy:" : `${i + 1}e`
                }  **|** ${username}`,
                value: `${place.votes} votes`,
                inline: true,
            };
        })
    );

    embed.addFields(fieldsLeaderboard);

    await constants.channels.bot.send({ embeds: [embed] });

    const member = constants.workingGuild.members.cache.get(
        leaderboard[0].user
    );
    member.user.giveItem(itemIds.superDreamTeamPass, 1);
    member.send(
        "Vous avez gagné le vote du mois, profitez de votre rôle **SUPER DREAM TEAM** ce mois-ci."
    );

    const currentDate = new Date();
    const stopDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        2,
        1
    );

    runAtDate(stopDate, sendVoteStop);
}

module.exports = {
    initVotes,
};
