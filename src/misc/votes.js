const { EmbedBuilder } = require("discord.js");
const { runAtDate } = require("../utils/date");
const constantIDs = require("../constants/ids");
const { options, client } = require("../client");
const db = require("../data/db");
const itemIds = require("../inventory/itemIds");

function initVotes() {
    const currentDate = new Date();
    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
        1,
        0,
        0,
        0
    );
    const stopDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (currentDate.getDate() >= 2 ? 1 : 0),
        2,
        1,
        0,
        0,
        0
    );

    runAtDate(startDate, sendVoteStart);
    runAtDate(stopDate, sendVoteStop);
}

async function sendVoteStart() {
    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":envelope:  __**Les votes du mois sont ouverts**__")
        .setDescription(
            `Les votes du mois sont ouverts, vous avez maintenant 24h pour élire le meilleur membre du serveur.\nL'élu recevra le rôle <@${
                constantIDs.roles.superDreamTeam[+options.test]
            }>`
        );
    await client.guilds.cache
        .get(constantIDs.workingGuild[+options.test])
        .channels.cache.get(constantIDs.channels.bot[+options.test])
        .send({ embeds: [embed] });

    db.resetVotes();

    const currentDate = new Date();
    const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
        1,
        0,
        0,
        0
    );

    runAtDate(startDate, sendVoteStart);
}

async function sendVoteStop() {
    const guild = client.guilds.cache.get(
        constantIDs.workingGuild[+options.test]
    );
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
            const guildMember = await guild.members.fetch(place.user);
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

    await guild.channels.cache
        .get(constantIDs.channels.bot[+options.test])
        .send({ embeds: [embed] });

    client.users.cache.get(leaderboard[0].user).giveItem(itemIds.superDreamTeamPass,1);

    const currentDate = new Date();
    const stopDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        2,
        1,
        0,
        0,
        0
    );

    runAtDate(stopDate, sendVoteStop);
}

module.exports = {
    initVotes
}