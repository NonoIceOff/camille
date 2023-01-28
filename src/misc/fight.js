const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Message,
    ButtonStyle,
} = require("discord.js");
const fs = require("fs");

const db = require("../data/db");

const victoryConditions = ["Points", "Kills"];

var { season } = require("../../data/fight.json");
const path = require("path");
const { constants } = require("../utils/clientConstants");
var settings = { players: 8, qualifyingRounds: 3, victoryCondition: 0 };
var players = [];
var started = false;

if (!season) season = require("../../data/fight.json").Saisons.Number ?? 1;

/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onButton(interaction) {
    if (interaction.isButton()) {
        let path = interaction.customId.split("/");
        if (path[0] === "fight") {
            if (path[1] === "settings") {
                if (started) {
                    interaction.reply({
                        content:
                            "Tu peux pas faire ça, le jeu est déjà en cours.",
                        ephemeral: true,
                    });
                    return;
                }
                if (path[2] === "players") {
                    const possibleValues = [4, 8, 16, 32];
                    settings.players =
                        possibleValues[
                            (possibleValues.indexOf(settings.players) + 1) % 4
                        ];
                    await interaction.deferUpdate();
                    editSettingsPanel(interaction.message);
                } else if (path[2] === "rounds") {
                    const possibleValues = [3, 5];
                    settings.qualifyingRounds =
                        possibleValues[
                            (possibleValues.indexOf(settings.qualifyingRounds) +
                                1) %
                                2
                        ];
                    await interaction.deferUpdate();
                    editSettingsPanel(interaction.message);
                } else if (path[2] === "victory") {
                    settings.victoryCondition =
                        (settings.victoryCondition + 1) % 2;
                    await interaction.deferUpdate();
                    editSettingsPanel(interaction.message);
                }
            } else if (path[1] === "launch") {
                if (started) {
                    interaction.reply({
                        content:
                            "Tu peux pas faire ça, le jeu est déjà en cours.",
                        ephemeral: true,
                    });
                    return;
                }

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("fight/join")
                        .setLabel("⚔️ INSCRIVEZ-VOUS")
                        .setStyle(ButtonStyle.Danger)
                );
                constants.events.fightDiscord.channel.send({
                    content: `**FIGHT DISCORD SAISON ${season}** (${players.length}/${settings.players})`,
                    components: [row],
                });

                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("fight/start")
                        .setLabel("⚔️ Lancer la saison")
                        .setStyle(ButtonStyle.Danger)
                );

                interaction.reply({
                    content: `**FIGHT DISCORD SAISON ${season}**`,
                    components: [row2],
                });
            } else if (path[1] === "start") {
                if (started) {
                    interaction.reply({
                        content:
                            "Tu peux pas faire ça, le jeu est déjà en cours.",
                        ephemeral: true,
                    });
                    return;
                }
                start();
            } else if (path[1] === "join") {
                if (started) {
                    interaction.reply({
                        content:
                            "Tu peux pas faire ça, le jeu est déjà en cours.",
                        ephemeral: true,
                    });
                    return;
                }
                if (!players.includes(interaction.user.id)) {
                    players.push(interaction.user.id);
                    await interaction.deferUpdate();
                    await interaction.editReply({
                        content: `**FIGHT DISCORD SAISON ${season}** (${players.length}/${settings.players})`,
                    });
                } else {
                    interaction.reply({
                        content: "Bah non, tu vas pas t'inscrire 50 fois.",
                        ephemeral: true,
                    });
                }
            }
        }
    }
}

/**
 *
 * @param {Message} message
 */
async function editSettingsPanel(message) {
    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(`**Informations de la saison ${season} de Fight Discord**`)
        .setDescription(
            "*Les joueurs manquants seront remplacés par des IA. Le gagnant de la saison gagne.*"
        )
        .addFields(
            {
                name: `**JOUEURS :** ${settings.players}`,
                value: "4, 8, 16 ou 32",
            },
            {
                name: `**MANCHES QUALIFICATIONS :** ${settings.qualifyingRounds}`,
                value: "3 ou 5",
            },
            {
                name: `**CONDITION VICTOIRE :** ${
                    victoryConditions[settings.victoryCondition]
                }`,
                value: "Points ou Kills",
            }
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("fight/settings/players")
            .setLabel("JOUEURS")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("fight/settings/rounds")
            .setLabel("MANCHES Q")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("fight/settings/victory")
            .setLabel("VICTOIRE")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("fight/launch")
            .setLabel("⚔️ Lancer")
            .setStyle(ButtonStyle.Danger)
    );

    await message.edit({
        content: "",
        embeds: [embed],
        components: [row],
        fetchReply: true,
    });
}

/**
 * Start the season of Fight Discord
 */
async function start() {
    for (var i = 0; i < settings.players; i++) {
        if (players[i]) {
            const guildMember = await constants.workingGuild.members.fetch(
                players[i]
            );
            let username = `<!${players[i]}>`;
            if (guildMember)
                username = guildMember.nickname ?? guildMember.user.username;
            players[i] = { user: guildMember.user, name: username };
        } else {
            players[i] = { name: `IA${i}` };
        }
    }

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(`**Saison ${season} de Fight Discord**`)
        .setDescription(
            `*Voici le tableau des joueurs, qui joueront dans cette saison.*
        
${players
    .map(
        (player, i) => `**${player.name}** *(${player.user ? "Joueur" : "IA"})*`
    )
    .join("\n")}`
        )
        .setFooter({
            text: "Lancement dans 1h - avec intervale de 10 mins.",
        });

    await constants.events.fightDiscord.channel.send({ embeds: [embed] });

    setTimeout(() => startQualifyingRounds(0), 1000 * 60 * 60);
}

/**
 * Get the score of a player from his stats.
 * @param {number} playerIndex 
 * @returns 
 */
function getPlayerScore(playerIndex) {
    const deathMultiplier = Math.random() * (75 - 30) + 30;
    const pointMultiplier = Math.random() * (2.5 - 1) + 1;
    const kills = Math.floor(
        (Math.random() * (200 - 50) + 50) *
            (players[playerIndex].user ? 1 : 0.5)
    );
    return {
        kills: kills,
        deaths: Math.floor(kills / deathMultiplier),
        points: Math.floor(kills * pointMultiplier),
    };
}

/**
 * Starts the qualifying round of the playerIndex (and starts automatically the next rounds) 
 * @param {number} playerIndex 
 */
async function startQualifyingRounds(playerIndex) {
    const playerScore = getPlayerScore(playerIndex);
    players[playerIndex].score = playerScore;

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("**Fight Discord | Manche qualificative**")
        .setDescription(`**${players[playerIndex].name}**`)
        .addFields(
            {
                name: "Kills de mobs : ",
                value: playerScore.kills.toString(),
                inline: true,
            },
            {
                name: "Points gagnés : ",
                value: playerScore.points.toString(),
                inline: true,
            },
            {
                name: "Morts : ",
                value: playerScore.deaths.toString(),
                inline: true,
            }
        )
        .setFooter({
            text: `Episode ${playerIndex + 1} / ${settings.players}`,
        });

    await constants.events.fightDiscord.channel.send({ embeds: [embed] });

    playerIndex++;
    if (playerIndex < settings.players)
        setTimeout(() => startQualifyingRounds(playerIndex), 1000 * 60 * 10);
    else setTimeout(() => endQualifyingRounds(), 1000);
}

/**
 * Shows leaderboard of the qualifications then starts the finals.
 */
async function endQualifyingRounds() {
    var embeds = [
        new EmbedBuilder()
            .setColor(12154643)
            .setTitle("**Fight Discord | Manche qualificative | Résultats**"),
        new EmbedBuilder().setColor(12154643),
    ];

    players.sort((a, b) =>
        settings.victoryCondition == 0
            ? b.score.points - a.score.points
            : b.score.kills - a.score.kills
    );

    players.forEach((player, i) => {
        embeds[Math.floor(i / 24)].addFields({
            name: `${i < settings.players / 2 ? "🇶 " : ""}${player.name}`,
            value: `${
                settings.victoryCondition == 0
                    ? player.score.points
                    : player.score.kills
            } ${["points", "kills"][settings.victoryCondition]}`,
            inline: true,
        });
    });

    if (players.length <= 24) embeds.pop();

    await constants.events.fightDiscord.channel.send({ embeds: embeds });

    players.splice(settings.players / 2);
    settings.players /= 2;

    setTimeout(() => startFinals(), 1000);
}

/**
 * Says who is gonna play versus who then starts the finals rounds.
 */
async function startFinals() {
    const roundsName = {
        2: "Finale",
        4: "Demi-Finale",
        8: "Quart de Finale",
        16: "Huitième de Finale",
    };
    const roundName = roundsName[settings.players] ?? "Match";

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("**Fight Discord | Phase éliminatoire**");

    for (var i = 0; i < settings.players / 2; i++) {
        embed.addFields({
            name: `${roundName} ${i + 1}`,
            value: `${players[i].name} vs ${
                players[settings.players / 2 + i].name
            }`,
            inline: true,
        });
    }

    await constants.events.fightDiscord.channel.send({ embeds: [embed] });

    setTimeout(() => startFinalRounds(0), 1000 * 60 * 10);
}

/**
 * Starts the final round of the playerIndex (and starts automatically the next rounds)  
 * @param {number} playerIndex 
 */
async function startFinalRounds(playerIndex) {
    const roundsName = {
        2: "Finale",
        4: "Demi-Finale",
        8: "Quart de Finale",
        16: "Huitième de Finale",
    };
    const roundName = roundsName[settings.players] ?? "Match";
    const opponentIndex = settings.players / 2 + playerIndex;

    const playerScore = getPlayerScore(playerIndex);
    players[playerIndex].score = playerScore;

    const opponentScore = getPlayerScore(opponentIndex);
    players[opponentIndex].score = opponentScore;

    const playerWon =
        settings.victoryCondition == 0
            ? playerScore.points > opponentScore.points
            : playerScore.kills > opponentScore.kills;

    const draw =
        settings.victoryCondition == 0
            ? playerScore.points === opponentScore.points
            : playerScore.kills === opponentScore.kills;

    const embed = new EmbedBuilder()
        .setColor(12154643)
        .setTitle(
            `**Fight Discord | ${roundName} ${playerIndex + 1}| Résultats**`
        )
        .addFields([
            {
                name: `${playerWon || draw ? "🇶 " : ""}${
                    players[playerIndex].name
                }`,
                value: `${
                    settings.victoryCondition == 0
                        ? playerScore.points
                        : playerScore.kills
                } ${["points", "kills"][settings.victoryCondition]}`,
                inline: true,
            },
            {
                name: `${!playerWon || draw ? "🇶 " : ""}${
                    players[opponentIndex].name
                }`,
                value: `${
                    settings.victoryCondition == 0
                        ? opponentScore.points
                        : opponentScore.kills
                } ${["points", "kills"][settings.victoryCondition]}`,
                inline: true,
            },
        ]);

    await constants.events.fightDiscord.channel.send({ embeds: [embed] });

    if (!draw)
        if (playerWon) players[opponentIndex] = undefined;
        else players[playerIndex] = undefined;

    if (playerIndex + 1 < settings.players / 2 || draw) {
        setTimeout(
            () => startFinalRounds(playerIndex + (draw ? 0 : 1)),
            1000 * 60 * 10
        );
    } else {
        settings.players /= 2;

        players = players.filter((player) => player);

        if (settings.players > 1) {
            setTimeout(() => startFinals(), 1000 * 60 * 10);
        } else {
            await constants.events.fightDiscord.channel.send(
                `:tada: **${players[0].name} a gagné**`
            );

            const userId = players[0].user ? players[0].id : players[0].name;

            if (await db.checkFightWin(userId)) {
                db.addFightWins(userId, 1);
            } else {
                db.registerFightWin(userId, 1);
            }

            season++;
            fs.writeFileSync(
                path.join(process.cwd(), "data/fight.json"),
                JSON.stringify({ season: season })
            );
        }
    }
}

module.exports = {
    onButton,
    editSettingsPanel,
};
