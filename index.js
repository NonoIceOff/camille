"use strict";
const test = 1;
const config = require("./config");
const {} = require("./src/data/prototype/User");
const {} = require("./src/xp/prototype/User");
const constantIDs = require("./src/constants/ids");
const constantYoutube = require("./src/constants/youtube");
const { client, options, init } = require("./src/client");
const {} = require("./src/events");
const db = require("./src/data/db");

const {
    REST,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Events,
    AttachmentBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const editJsonFile = require("edit-json-file");
var cron = require("cron");
var Canvas = null;
if (test == 0) {
    Canvas = require("@napi-rs/canvas-linux-arm-gnueabihf");
} else {
    Canvas = require("@napi-rs/canvas");
}
const { request } = require("undici");

var guild_id = constantIDs.workingGuild[test];

const { joinVoiceChannel } = require("@discordjs/voice");

var rest = new REST({ version: "10" }).setToken(config.token);
if (test == 1) {
    rest = new REST({ version: "10" }).setToken(config.testToken);
}

var adminrole = null;
var dreamteam = null;

const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");


const applyText = (canvas, text) => {
    const context = canvas.getContext("2d");

    // Declare a base size of the font
    let fontSize = 70;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `${(fontSize -= 10)}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return context.font;
};

async function givegrades() {
    const Role = client.guilds.cache
        .get(guild_id)
        .roles.cache.get(constantIDs.roles.superDreamTeam[test]);
    Role.members.forEach((member, i) => {
        // Looping through the members of Role.
        member.roles.remove(Role); // Removing the Role.
    });

    const Role2 = client.guilds.cache
        .get(guild_id)
        .roles.cache.get(constantIDs.roles.dreamTeamPlus[test]);
    Role2.members.forEach((member, i) => {
        // Looping through the members of Role.
        member.roles.remove(Role2); // Removing the Role.
    });

    const Role3 = client.guilds.cache
        .get(guild_id)
        .roles.cache.get(constantIDs.roles.dreamTeam[test]);
    Role3.members.forEach((member, i) => {
        // Looping through the members of Role.
        member.roles.remove(Role3); // Removing the Role.
    });

    let file2 = editJsonFile("./shop.json");
    var shopdico = file2.get("Members");

    for (const [key, value] of Object.entries(shopdico)) {
        let member = await client.guilds.cache.get(guild_id).members.fetch(key);

        if (!shopdico[key]) {
            shopdico[key] = { Grades: [0, 0, 0] };
            file2.set("Members", shopdico);
            file2.save();
        }

        for (let i = 0; i < 3; i++) {
            if (shopdico[key]["Grades"][i] >= 1) {
                if (i == 0) {
                    var role = client.guilds.cache
                        .get(guild_id)
                        .roles.cache.find(
                            (r) => r.id === constantIDs.roles.dreamTeam[test]
                        );
                    member.roles.add(role).catch(console.error);
                }
                if (i == 1) {
                    var role = client.guilds.cache
                        .get(guild_id)
                        .roles.cache.find(
                            (r) =>
                                r.id === constantIDs.roles.dreamTeamPlus[test]
                        );
                    member.roles.add(role).catch(console.error);
                }
                if (i == 2) {
                    var role = client.guilds.cache
                        .get(guild_id)
                        .roles.cache.find(
                            (r) =>
                                r.id === constantIDs.roles.superDreamTeam[test]
                        );
                    member.roles.add(role).catch(console.error);
                }
                shopdico[key]["Grades"][i] -= 1;
                file2.set("Members", shopdico);
                file2.save();
            }
        }
    }
}

function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_HOUR = 1000 * 60 * 60;
    const _MS_PER_MINUTE = 1000 * 60;
    // Discard the time and time-zone information.
    const utc1 = a;
    const utc2 = b;
    var days = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    var hours = Math.floor((utc2 - utc1) / _MS_PER_HOUR) - days * 24;
    var minutes =
        Math.floor((utc2 - utc1) / _MS_PER_MINUTE) -
        days * 60 * 24 -
        hours * 60;
    return days + "j " + hours + "h " + minutes + "m";
}

async function newvid() {
    const data = await parser
        .parseURL(
            "https://youtube.com/feeds/videos.xml?channel_id=" +
                constantYoutube.channelId
        )
        .catch(console.error);
    const rawData = fs.readFileSync("./video.json");
    const jsonData = JSON.parse(rawData);

    if (jsonData.id !== data.items[0].id) {
        // new video or video not sent
        fs.writeFileSync(
            "./video.json",
            JSON.stringify({ id: data.items[0].id })
        );
        const { title, link, id, author } = data.items[0];
        var imagea = "https://i3.ytimg.com/vi/";
        imagea += id.slice(9);
        imagea += "/maxresdefault.jpg";
        const Embed = new EmbedBuilder({
            title: title,
            description:
                "Pour voir la vidéo, il vous suffit de cliquer sur le titre",
            url: link,
            color: 10181046,
            timestamp: Date.now(),
            image: {
                url: imagea,
            },
            author: {
                name: author,
                iconURL: constantYoutube.channelIcon,
                url: constantYoutube.channelLink,
            },
        });

        if (data.items[0]["title"].includes("#shorts") == true) {
            await client.guilds.cache
                .get(guild_id)
                .channels.cache.get(constantIDs.channels.shortPost[test])
                .send({
                    content: "<@&946429189630881872> **Nouveau short !**",
                    embeds: [Embed],
                });
        } else {
            await client.guilds.cache
                .get(guild_id)
                .channels.cache.get(constantIDs.channels.youtubePost[test])
                .send({
                    content: "<@&940294478038696006> **Nouvelle vidéo !**",
                    embeds: [Embed],
                });
        }
    }
}

async function startvote() {
    let file = editJsonFile("./infos.json");
    var votesdico = file.get("votes");
    votesdico["voted"] = { start: 1 };
    if (votesdico["winner"]) {
        role = client.guilds.cache
            .get(guild_id)
            .roles.cache.find(
                (r) => r.id === constantIDs.roles.superDreamTeam[test]
            );
        client.guilds.cache
            .get(guild_id)
            .members.fetch(votesdico["winner"])
            .then((member) => {
                member.roles.remove(role);
            })
            .catch(console.log);
        delete votesdico["winner"];
    }
    file.set("votes", votesdico);
    file.save();

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":envelope:  __**Les votes du mois sont ouverts**__")
        .setDescription(
            "Les votes du mois sont ouverts, vous avez maintenant 24h pour élire le meilleur membre du serveur.\nL'élu recevra le rôle <@1045446827887042700>"
        );
    client.guilds.cache
        .get(guild_id)
        .channels.cache.get(constantIDs.channels.bot[test])
        .send({ embeds: [embed] });

    file.set("votes", votesdico);
    file.save();
}

async function stopvote() {
    let file = editJsonFile("./infos.json");
    var votesdiso = file.get("votes");
    var winner_user = null;
    delete votesdiso["voted"];

    var membersnbr = 0; // NUMBER OF MEMBERS
    for (var i in votesdiso) {
        if (votesdiso.hasOwnProperty(i)) membersnbr++;
    }

    var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
    for (var i in votesdiso) {
        classementarray.push([votesdiso[i], i]);
    }
    classementarray.sort(
        (function (index) {
            return function (a, b) {
                return a[index] === b[index] ? 0 : a[index] < b[index] ? 1 : -1;
            };
        })(0)
    );

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(
            ":envelope:  __**Fermeture des votes, voici les résultats :**__"
        );
    for (let i = 1; i <= membersnbr; i++) {
        user = await client.users.fetch(classementarray[i - 1][1]);
        let membered = user;

        var personne = membered;
        if (membered === undefined) {
            personne = "membre non connu";
        } else {
            personne = membered.username;
        }
        if (i == 1) {
            embed.addFields({
                name: ":trophy:  **|** " + personne,
                value: classementarray[i - 1][0].toString() + " votes",
                inline: true,
            });
            winner_user = await client.users.fetch(classementarray[i - 1][1]);
        }
        if (i > 1) {
            embed.addFields({
                name: i.toString() + "e **|** " + personne,
                value: classementarray[i - 1][0].toString() + " votes",
                inline: true,
            });
        }
    }
    client.guilds.cache
        .get(guild_id)
        .channels.cache.get(constantIDs.channels.bot[test])
        .send({ embeds: [embed] });

    votesdiso = {};
    votesdiso["voted"] = { start: 0 };
    votesdiso["winner"] = winner_user.id;
    file.set("votes", votesdiso);
    file.save();

    role = client.guilds.cache
        .get(guild_id)
        .roles.cache.find(
            (r) => r.id === constantIDs.roles.superDreamTeam[test]
        );
    const member = client.guilds.cache
        .get(guild_id)
        .members.cache.get(winner_user.id);
    member.roles.add(role).catch(console.error);
    member.send(
        "Vous avez gagné le vote du mois, profitez de votre rôle **SUPER DREAM TEAM** ce mois-ci."
    );
}

function start_voicetime_to_user(user) {
    let file = editJsonFile("./infos.json");
    var voicemember = file.get("voice");
    var olddate = new Date();
    var timestampInS = Math.floor(olddate.getTime() / 1000);
    voicemember[user.id] = timestampInS;
    file.set("voice", voicemember);
    file.save();
}

function stop_voicetime_to_user(user) {
    let file = editJsonFile("./infos.json");
    var voicemember = file.get("voice");
    var newdate = new Date(); // Ajouter le temps
    var timestampInS = Math.floor(newdate.getTime() / 1000);
    if (!voicemember["members_leaderboard"][user.id]) {
        voicemember["members_leaderboard"][user.id] = 0;
    }
    if (voicemember["members_leaderboard"][user.id] == null) {
        voicemember["members_leaderboard"][user.id] = 0;
    }
    file.set("voice", voicemember);
    file.save();
    if (voicemember[user.id]) {
        var diff = timestampInS - voicemember[user.id];
        voicemember["members_leaderboard"][user.id] += diff;
        delete voicemember[user.id];
        file.set("voice", voicemember);
        file.save();
        var diff_min = Math.floor(diff / 60);
        add_xp_to_user(user, 5 * diff_min);
    }
}

async function start_fight_qualifs() {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));

    let file = editJsonFile("./fight.json");
    var fightdico = file.get("Saisons");

    var max = fightdico[fightdico["Number"].toString()]["Joueurs"];
    var qualified = 0;
    if (max === 4) {
        qualified = 2;
    } else if (max === 8) {
        qualified = 4;
    } else if (max === 16) {
        qualified = 8;
    } else if (max === 32) {
        qualified = 16;
    }

    fightdico[fightdico["Number"].toString()]["Qualifs"] = {};

    for (var i = 0; i < max; i++) {
        var key = fightdico[fightdico["Number"].toString()]["Inscriptions"][i];

        fightdico[fightdico["Number"].toString()]["Qualifs"][key] = {
            Points: 0,
            Morts: 0,
            Kills: 0,
        };
        fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Kills"] =
            Math.floor(Math.random() * (200 - 50) + 50);
        var multiplier_deaths = Math.random() * (75 - 30) + 30;
        fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Morts"] =
            Math.floor(
                fightdico[fightdico["Number"].toString()]["Qualifs"][key][
                    "Kills"
                ] / multiplier_deaths
            );
        var multiplier = Math.random() * (2.5 - 1) + 1;
        fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Points"] =
            Math.floor(
                fightdico[fightdico["Number"].toString()]["Qualifs"][key][
                    "Kills"
                ] * multiplier
            );

        file.set("Saisons", fightdico);
        file.save();

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle("**Fight Discord | Manche qualificative**")
            .addFields(
                {
                    name: "Kills de mobs : ",
                    value: fightdico[fightdico["Number"].toString()]["Qualifs"][
                        key
                    ]["Kills"].toString(),
                    inline: true,
                },
                {
                    name: "Points gagnés : ",
                    value: fightdico[fightdico["Number"].toString()]["Qualifs"][
                        key
                    ]["Points"].toString(),
                    inline: true,
                },
                {
                    name: "Morts : ",
                    value: fightdico[fightdico["Number"].toString()]["Qualifs"][
                        key
                    ]["Morts"].toString(),
                    inline: true,
                }
            )
            .setFooter({
                text: "Episode " + (i + 1).toString() + " / " + max.toString(),
            });

        if (key.includes("IA") == false) {
            user = await client.users.fetch(key);
            embed.setDescription("**" + user.username + "**");
        } else {
            embed.setDescription("**" + key + "**");
        }

        await timer((60000 / 60) * 600); // then the created Promise can be awaited
        client.guilds.cache
            .get(guild_id)
            .channels.cache.get(constantIDs.event.fightDiscord.channel[test])
            .send({ embeds: [embed] });
    }

    await timer(60000 / 60); // Pause de 10 sec
    var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
    var resultdico = fightdico[fightdico["Number"].toString()]["Qualifs"];
    for (var i in resultdico) {
        classementarray.push([resultdico[i]["Points"], i]);
    }
    classementarray.sort(
        (function (index) {
            return function (a, b) {
                return a[index] === b[index] ? 0 : a[index] < b[index] ? 1 : -1;
            };
        })(0)
    );

    var embed = new EmbedBuilder()
        .setColor(12154643)
        .setTitle("**Fight Discord | Manche qualificative | Résultats**");

    fightdico[fightdico["Number"].toString()]["Finals"] = {};

    for (let i = 1; i <= max; i++) {
        var user = classementarray[i - 1][1];
        var pseudo = "";
        var match = 0;

        if (user.includes("IA") == false) {
            let usered = await client.users.fetch(classementarray[i - 1][1]);
            pseudo = usered.username;
        } else {
            pseudo = classementarray[i - 1][1];
        }

        var points = classementarray[i - 1][0];
        if (i == 20) {
            client.guilds.cache
                .get(guild_id)
                .channels.cache.get(
                    constantIDs.event.fightDiscord.channel[test]
                )
                .send({ embeds: [embed] });
            var embed = new EmbedBuilder()
                .setColor(12154643)
                .setTitle(
                    "**Fight Discord | Manche qualificative | Résultats 2**"
                );
        }
        if (i <= qualified) {
            match = i / 2;
            embed.addFields({
                name: "🇶 " + pseudo,
                value: points.toString() + " points",
                inline: true,
            });
            fightdico[fightdico["Number"].toString()]["Finals"][
                classementarray[i - 1][1]
            ] = { Phase: 1, Points: 0, Kills: 0, Morts: 0, Match: match };
        } else {
            embed.addFields({
                name: pseudo,
                value: points.toString() + " points",
                inline: true,
            });
        }
    }

    file.set("Saisons", fightdico);
    file.save();

    client.guilds.cache
        .get(guild_id)
        .channels.cache.get(constantIDs.event.fightDiscord.channel[test])
        .send({ embeds: [embed] });

    await timer(60000 / 60);
    start_fight_finals();
}

async function start_fight_finals() {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    let file = editJsonFile("./fight.json");
    var fightdico = file.get("Saisons");

    fightdico[fightdico["Number"].toString()]["Inscriptions"] = [];
    file.set("Saisons", fightdico);
    file.save();

    var max = Object.keys(
        fightdico[fightdico["Number"].toString()]["Finals"]
    ).length;
    var win = "";
    while (max >= 2) {
        var newinscrs = [];
        var embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle("**Fight Discord | Phase éliminatoire**");

        var intitule = "Match";
        if (max == 4) {
            intitule = "Demi-Finale";
        } else if (max == 8) {
            intitule = "Quart de Finale";
        } else if (max == 16) {
            intitule = "Huitième de Finale";
        } else if (max == 2) {
            intitule = "Finale";
        }

        var min = 0; // AFFICHER LES MATCHS
        var text = "";
        for (const [key, value] of Object.entries(
            fightdico[fightdico["Number"].toString()]["Finals"]
        )) {
            fightdico[fightdico["Number"].toString()]["Inscriptions"].push(key);
            if (min % 2 == 1) {
                text += " vs " + key;
                embed.addFields({
                    name: intitule + " " + (Math.floor(min / 2) + 1).toString(),
                    value: text,
                    inline: true,
                });
                text = "";
            } else {
                text += key;
            }
            min += 1;
        }
        client.guilds.cache
            .get(guild_id)
            .channels.cache.get(constantIDs.event.fightDiscord.channel[test])
            .send({ embeds: [embed] });

        await timer((60000 / 60) * 600);

        var match_j1 = ["id", 0];
        var match_j2 = ["id", 0];
        var pseudos = ["", ""];
        var newfinal = {};
        for (var i = 0; i < max; i++) {
            // LES MATCHS
            var key =
                fightdico[fightdico["Number"].toString()]["Inscriptions"][i];

            fightdico[fightdico["Number"].toString()]["Finals"][key]["Kills"] =
                Math.floor(Math.random() * (200 - 50) + 50);
            var multiplier_deaths = Math.random() * (75 - 30) + 30;
            fightdico[fightdico["Number"].toString()]["Finals"][key]["Morts"] =
                Math.floor(
                    fightdico[fightdico["Number"].toString()]["Finals"][key][
                        "Kills"
                    ] / multiplier_deaths
                );
            var multiplier = Math.random() * (2.5 - 1) + 1;
            fightdico[fightdico["Number"].toString()]["Finals"][key]["Points"] =
                Math.floor(
                    fightdico[fightdico["Number"].toString()]["Finals"][key][
                        "Kills"
                    ] * multiplier
                );

            const embed = new EmbedBuilder()
                .setColor(12154643)
                .setTitle(
                    "**Fight Discord | " +
                        intitule +
                        " " +
                        (Math.floor(i / 2) + 1).toString() +
                        "| Résultats**"
                );

            var pseuded = "";
            if (key.includes("IA") == false) {
                user = await client.users.fetch(key);
                pseuded = user.username;
            } else {
                pseuded = key;
            }
            pseudos[i] = pseuded;

            if (i % 2 == 0) {
                pseudos[0] = pseuded;
                match_j1[0] = key;
                match_j1[1] =
                    fightdico[fightdico["Number"].toString()]["Finals"][key][
                        "Points"
                    ];
                match_j2 = ["id", 0];
                pseudos[1] = "";
            } else if (i % 2 == 1) {
                pseudos[1] = pseuded;
                match_j2[0] = key;
                match_j2[1] =
                    fightdico[fightdico["Number"].toString()]["Finals"][key][
                        "Points"
                    ];

                if (match_j1[1] >= match_j2[1]) {
                    win = match_j1[0];
                    newinscrs.push(match_j1[0]);
                    newfinal[match_j1[0]] = {
                        Phase: 1,
                        Points: 0,
                        Kills: 0,
                        Morts: 0,
                        Match: i / 2,
                    };
                    embed.addFields({
                        name: "🇶 " + pseudos[0],
                        value: match_j1[1].toString() + " points",
                        inline: true,
                    });
                    embed.addFields({
                        name: pseudos[1],
                        value: match_j2[1].toString() + " points",
                        inline: true,
                    });
                } else {
                    newinscrs.push(match_j2[0]);
                    newfinal[match_j2[0]] = {
                        Phase: 1,
                        Points: 0,
                        Kills: 0,
                        Morts: 0,
                        Match: i / 2,
                    };
                    embed.addFields({
                        name: "🇶 " + pseudos[1],
                        value: match_j2[1].toString() + " points",
                        inline: true,
                    });
                    embed.addFields({
                        name: pseudos[0],
                        value: match_j1[1].toString() + " points",
                        inline: true,
                    });
                }

                client.guilds.cache
                    .get(guild_id)
                    .channels.cache.get(
                        constantIDs.event.fightDiscord.channel[test]
                    )
                    .send({ embeds: [embed] });
                match_j1 = ["id", 0];
                pseudos[0] = "";
                await timer((60000 / 60) * 600);
            }

            file.set("Saisons", fightdico);
            file.save();
        }

        fightdico[fightdico["Number"].toString()]["Finals"] = newfinal;
        fightdico[fightdico["Number"].toString()]["Inscriptions"] = newinscrs;
        file.set("Saisons", fightdico);
        file.save();

        await timer(60000 / 60);

        max = max / 2;
    }
    client.guilds.cache
        .get(guild_id)
        .channels.cache.get(constantIDs.event.fightDiscord.channel[test])
        .send(":tada: **" + win + " a gagné**");
    fightdico["Number"] = fightdico["Number"] + 1;

    if (!fightdico["Wins"][win]) {
        fightdico["Wins"][win] = 1;
    } else {
        fightdico["Wins"][win] = fightdico["Wins"][win] + 1;
    }

    file.set("Saisons", fightdico);
    file.save();
}

function embed_fight(message) {
    let file = editJsonFile("./fight.json");
    var fightdico = file.get("Saisons");

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("**Informations de la saison 1 de Fight Discord**")
        .setDescription(
            "*Les joueurs manquants seront remplacés par des IA. Le gagnant de la saison gagne.*"
        )
        .addFields(
            {
                name:
                    "**JOUEURS :** " +
                    fightdico[fightdico["Number"].toString()][
                        "Joueurs"
                    ].toString(),
                value: "4, 8, 16 ou 32",
            },
            {
                name:
                    "**MANCHES QUALIFICATIONS :** " +
                    fightdico[fightdico["Number"].toString()][
                        "ManchesQ"
                    ].toString(),
                value: "3 ou 5",
            },
            {
                name:
                    "**CONDITION VICTOIRE :** " +
                    fightdico[fightdico["Number"].toString()]["Victoire"],
                value: "Points ou Kills",
            }
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("fight_players")
                .setLabel("JOUEURS")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("fight_manches")
                .setLabel("MANCHES Q")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("fight_victoire")
                .setLabel("VICTOIRE")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("fight_launch")
                .setLabel("⚔️ Lancer")
                .setStyle(ButtonStyle.Danger)
        );

    message.edit({
        embeds: [embed],
        components: [row],
        fetchReply: true,
    });
}

function game_jp(user) {
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");

    // Si le joueur n'a pas le jeu de lancé
    if (!membersdico[user.id]) {
        membersdico[user.id] = {
            game_name: "juste_prix",
            essais: 0,
            result: Math.floor(Math.random() * 1000) + 1,
            gain: 1.5,
        };
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Juste Prix__**")
            .setDescription(
                "Veuillez entrer un nombre entre 1 et 1000 sur le tchat."
            );
        user.send({ embeds: [embed] });
        file.set("games", membersdico);
        file.save();
    }

    var in_game = true;
    var number_bot = 0;
    var number_placed = 0;
    if (membersdico[user.id]) {
        if (membersdico[user.id]["result"]) {
            number_bot = membersdico[user.id]["result"];
        }
    }
    if (typeof user !== "undefined" && !user.bot) {
        user.createDM().then(async (channel) => {
            channel.messages
                .fetch({ limit: 1 })
                .then((messages) => {
                    let lastMessage = messages.first();
                    if (!lastMessage.author.bot) {
                        // SI ENCORE ESSAIS
                        if (!isNaN(lastMessage.content)) {
                            number_bot = membersdico[user.id]["result"];
                            number_placed = parseInt(lastMessage.content);
                            if (number_placed > 0 && number_placed < 1001) {
                                // SI PAS LE BON NOMBRE
                                if (number_placed != number_bot) {
                                    membersdico[user.id]["essais"] += 1;
                                    membersdico[user.id]["gain"] =
                                        Math.floor(
                                            (membersdico[user.id]["gain"] -
                                                0.1) *
                                                10
                                        ) / 10;
                                    if (membersdico[user.id]["gain"] < 0) {
                                        membersdico[user.id]["gain"] = 0;
                                    }
                                    file.set("games", membersdico);
                                    file.save();
                                    if (number_placed > number_bot) {
                                        user.send(
                                            "**Plus petit...**\nVous êtes à " +
                                                membersdico[user.id]["essais"] +
                                                " essais. *En jeu : " +
                                                membersdico[user.id]["gain"] +
                                                " :coin:*"
                                        );
                                    }
                                    if (number_placed < number_bot) {
                                        user.send(
                                            "**Plus grand...**\nVous êtes à " +
                                                membersdico[user.id]["essais"] +
                                                " essais. *En jeu : " +
                                                membersdico[user.id]["gain"] +
                                                " :coin:*"
                                        );
                                    }
                                } else {
                                    const embed = new EmbedBuilder()
                                        .setColor(10181046)
                                        .setTitle(
                                            ":tada: **__Félicitations__**"
                                        )
                                        .setDescription(
                                            "Vous avez trouvé le nombre " +
                                                number_bot +
                                                " en " +
                                                (membersdico[user.id][
                                                    "essais"
                                                ] +
                                                    1) +
                                                " essais."
                                        )
                                        .addFields({
                                            name: "Gains récupérés",
                                            value:
                                                +membersdico[user.id]["gain"] +
                                                " :coin:",
                                        });
                                    const row =
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setCustomId("jp_rematch")
                                                .setLabel("REJOUER")
                                                .setStyle(ButtonStyle.Danger)
                                        );
                                    user.send({
                                        embeds: [embed],
                                        components: [row],
                                    });
                                    var coinsdico = file.get("members");
                                    coinsdico[user.id]["esheep"] +=
                                        membersdico[user.id]["gain"];
                                    delete membersdico[user.id];
                                    file.set("games", membersdico);
                                    file.set("members", coinsdico);
                                    file.save();
                                }
                            } else {
                                user.send(
                                    "Veuillez plutôt entrer un nombre entre 1 et 1000 s'il vous plait. (erreur : nombre non compris)"
                                );
                            }
                        } else {
                            user.send(
                                "Veuillez plutôt entrer un nombre entre 1 et 1000 s'il vous plait. (erreur : n'est pas un nombre)"
                            );
                        }
                    }
                })
                .catch(console.error);
        });
    }
}

async function game_pfc(user, nbr) {
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");
    var coinsdico = file.get("members");
    var itemgame = ["pierre", "feuille", "ciseaux"];
    // Si le joueur n'a pas le jeu de lancé
    if (!membersdico[user.id]) {
        membersdico[user.id] = {
            game_name: "pierre_feuille_ciseaux",
            game: 1,
            points: 0,
            result: Math.floor(Math.random() * (2 - 0 + 1) + 0),
            gain: 0,
        };
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Pierre Feuille Ciseaux__**")
            .setDescription(
                "Il faut savoir que je choisis mon objet quand la manche démarre, pas de soucis à se faire !."
            );
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("pierre_button")
                    .setLabel("🗿 Pierre")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("feuille_button")
                    .setLabel("🧻 Feuille")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ciseaux_button")
                    .setLabel("✂️ Ciseaux")
                    .setStyle(ButtonStyle.Secondary)
            );

        await user.send({ embeds: [embed], components: [row] });
        file.set("games", membersdico);
        file.save();
    } else {
        var in_game = true;
        var item_bot = itemgame[membersdico[user.id]["result"]];
        var item_user = itemgame[nbr - 1];
        var number_placed = 0;

        if (item_user === item_bot) {
            // SI c'est le même objet
            user.send(
                "Oh bah c'est marrant, on a le même objet " + item_bot + "."
            );
        } else {
            if (item_user === "feuille" && item_bot === "pierre") {
                // SI FEUILLE VS PIERRE
                membersdico[user.id]["points"] += 1;
                membersdico[user.id]["gain"] += 0.3;
                user.send(
                    "**Feuille** contre **Pierre**, vous avez gagné cette manche."
                );
            }
            if (item_user === "pierre" && item_bot === "feuille") {
                // SI PIERRE VS PAPIER
                user.send(
                    "**Pierre** contre **Feuille**, vous avez perdu cette manche."
                );
            }
            if (item_user === "feuille" && item_bot === "ciseaux") {
                // SI FEUILLE VS CISEAUX
                user.send(
                    "**Feuille** contre **Ciseaux**, vous avez perdu cette manche."
                );
            }
            if (item_user === "ciseaux" && item_bot === "feuille") {
                // SI CISEAUX VS FEUILLE
                membersdico[user.id]["points"] += 1;
                membersdico[user.id]["gain"] += 0.3;
                user.send(
                    "**Ciseaux** contre **Feuille**, vous avez gagné cette manche."
                );
            }
            if (item_user === "ciseaux" && item_bot === "pierre") {
                // SI CISEAUX VS PIERRE
                user.send(
                    "**Ciseaux** contre **Pierre**, vous avez perdu cette manche."
                );
            }
            if (item_user === "pierre" && item_bot === "ciseaux") {
                // SI PIERRE VS CISEAUX
                membersdico[user.id]["points"] += 1;
                membersdico[user.id]["gain"] += 0.3;
                user.send(
                    "**Pierre** contre **Ciseaux**, vous avez gagné cette manche."
                );
            }
            membersdico[user.id]["game"] += 1;
            file.set("games", membersdico);
            file.save();
        }
        membersdico[user.id]["result"] = Math.floor(
            Math.random() * (2 - 0 + 1) + 0
        );
        file.set("games", membersdico);
        file.save();

        if (membersdico[user.id]["game"] > 5) {
            if (membersdico[user.id]["points"] >= 3) {
                const embed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(":tada: **__Félicitations__**")
                    .setDescription(
                        "Vous m'avez battu dans cette partie. Vous avez remporté " +
                            membersdico[user.id]["points"] +
                            " manches c'est ENORME !"
                    )
                    .addFields({
                        name: "Gains récupérés",
                        value: +membersdico[user.id]["gain"] + " :coin:",
                    });
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("pfc_rematch")
                        .setLabel("REJOUER (marche pas trop)")
                        .setStyle(ButtonStyle.Danger)
                );
                user.send({ embeds: [embed] });
            } else {
                membersdico[user.id]["gain"] = 0;
                const embed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(":cry:  **__Mince...__**")
                    .setDescription(
                        "Vous m'avez pas battu dans cette partie. Vous avez remporté " +
                            membersdico[user.id]["points"] +
                            " manches contre 3 requises."
                    )
                    .addFields({
                        name: "Gains récupérés",
                        value: +membersdico[user.id]["gain"] + " :coin:",
                    });
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("pfc_rematch")
                        .setLabel("REJOUER (marche pas trop)")
                        .setStyle(ButtonStyle.Danger)
                );
                user.send({ embeds: [embed] });
            }
            coinsdico[user.id]["esheep"] += membersdico[user.id]["gain"];
            file.set("members", coinsdico);
            delete membersdico[user.id];
            file.set("games", membersdico);
            file.save();
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("pierre_button")
                        .setLabel("🗿 Pierre")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("feuille_button")
                        .setLabel("🧻 Feuille")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("ciseaux_button")
                        .setLabel("✂️ Ciseaux")
                        .setStyle(ButtonStyle.Secondary)
                );

            user.send({
                content: "___\n**NOUVELLE MANCHE**\n",
                components: [row],
            });
        }
    }
}

function game_p4(user) {
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");
    var coinsdico = file.get("members");
    var itemgame = ["pierre", "feuille", "ciseaux"];
    var victory = false;
    // Si le joueur n'a pas le jeu de lancé
    if (!membersdico[user.id]) {
        membersdico[user.id] = {
            game_name: "puissance_4",
            selection: 0,
            x: -1,
            y: -1,
            grille: [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
            ],
            gain: 0,
        };
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Puissance 4__**")
            .setDescription(
                "Veuillez entrer la position de votre pion, de 1 à 7."
            );
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_1")
                    .setLabel("1")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_2")
                    .setLabel("2")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_3")
                    .setLabel("3")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_4")
                    .setLabel("4")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_5")
                    .setLabel("5")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_6")
                    .setLabel("6")
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("p4_7")
                    .setLabel("7")
                    .setStyle(ButtonStyle.Secondary)
            );
        user.send({ embeds: [embed] });
        show_puissance_4(user, membersdico[user.id]["grille"]);
        file.set("games", membersdico);
        file.save();
    }

    var in_game = true;
    var item_bot = itemgame[membersdico[user.id]["result"]];
    var number_placed = 0;

    if (typeof user !== "undefined" && !user.bot) {
        user.createDM().then(async (channel) => {
            channel.messages
                .fetch({ limit: 1 })
                .then((messages) => {
                    let lastMessage = messages.first();
                    lastMessage.content = lastMessage.content.toLowerCase();
                    if (!lastMessage.author.bot) {
                        // SI ENCORE ESSAIS
                        if (!isNaN(lastMessage.content)) {
                            if (
                                lastMessage.content > 0 &&
                                lastMessage.content <=
                                    7 - membersdico[user.id]["selection"]
                            ) {
                                let placements = place_puissance_4(
                                    user,
                                    1,
                                    lastMessage.content
                                );
                                membersdico[user.id]["grille"] = placements[0];
                                membersdico[user.id]["selection"] =
                                    placements[1];
                                file.set("games", membersdico);
                                file.save();
                                var x = placements[2];
                                detect_victory_puissance_4(
                                    user,
                                    1,
                                    membersdico[user.id]["grille"],
                                    x,
                                    lastMessage.content
                                );
                            } else {
                                user.send(
                                    "Veuillez plutôt entrer un chiffre entre 0 et " +
                                        (
                                            7 -
                                            membersdico[user.id]["selection"]
                                        ).toString() +
                                        " s'il vous plait. (erreur : n'est pas inclus)"
                                );
                            }
                        } else {
                            user.send(
                                "Veuillez plutôt entrer un chiffre entre 0 et " +
                                    (
                                        7 - membersdico[user.id]["selection"]
                                    ).toString() +
                                    " s'il vous plait. (erreur : n'est pas un chiffre)"
                            );
                        }

                        if (membersdico[user.id]["selection"] == -1) {
                            user.send("Colonne trop remplie.");
                            show_puissance_4(
                                user,
                                membersdico[user.id]["grille"]
                            );
                            membersdico[user.id]["selection"] = 0;
                            file.set("games", membersdico);
                            file.save();
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_1")
                                        .setLabel("1")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_2")
                                        .setLabel("2")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_3")
                                        .setLabel("3")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_4")
                                        .setLabel("4")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_5")
                                        .setLabel("5")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_6")
                                        .setLabel("6")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_7")
                                        .setLabel("7")
                                        .setStyle(ButtonStyle.Secondary)
                                );
                            user.send({
                                content:
                                    "Veuillez entrer la position de votre pion, de 1 à 7.",
                            });
                        }

                        if (membersdico[user.id]["selection"] > 0) {
                            user.send("C'est à mon tour, le place mon pion.");
                            var ia = Math.floor(Math.random() * 4) + 1;
                            var placements = null;
                            if (ia <= 1) {
                                placements = place_puissance_4(
                                    user,
                                    2,
                                    Math.floor(Math.random() * 7) + 1
                                );
                            } else if (ia === 2) {
                                placements = place_puissance_4(
                                    user,
                                    2,
                                    lastMessage.content
                                );
                            } else if (ia === 3) {
                                placements = place_puissance_4(
                                    user,
                                    2,
                                    lastMessage.content + 1
                                );
                            } else if (ia >= 4) {
                                placements = place_puissance_4(
                                    user,
                                    2,
                                    lastMessage.content - 1
                                );
                            }
                            var x = placements[2];
                            var y = placements[3];
                            detect_victory_puissance_4(
                                user,
                                2,
                                membersdico[user.id]["grille"],
                                x,
                                y
                            );
                            membersdico[user.id]["grille"] = placements[0];
                            //membersdico[user.id]["selection"] = placements[1]
                            file.set("games", membersdico);
                            file.save();
                            show_puissance_4(
                                user,
                                membersdico[user.id]["grille"]
                            );
                            membersdico[user.id]["selection"] = 0;
                            file.set("games", membersdico);
                            file.save();

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_1")
                                        .setLabel("1")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_2")
                                        .setLabel("2")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_3")
                                        .setLabel("3")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_4")
                                        .setLabel("4")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_5")
                                        .setLabel("5")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_6")
                                        .setLabel("6")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("p4_7")
                                        .setLabel("7")
                                        .setStyle(ButtonStyle.Secondary)
                                );
                            user.send({
                                content:
                                    "A ton tour ! Veuillez entrer la position de votre pion, de 1 à 7.",
                            });
                        }
                    }
                })
                .catch(console.error);
        });
    }
}

function place_puissance_4(user, player, pos) {
    // pos de 0 à 6 ligne de 0 à 5
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");
    var posed = false;
    var ligne = 5;
    var placements = 1;
    pos = pos - 1;
    while (posed === false) {
        if (pos < 0) {
            pos = 0;
        }
        if (pos > 6) {
            pos = 6;
        }
        if (ligne <= 0) {
            if (player == 2) {
                ligne = 5;
                pos += 1;
            } else {
                posed = true;
                placements = -1;
            }
        }
        if (player == 2) {
            if (pos > 6) {
                pos = 0;
            }
        }
        if (membersdico[user.id]["grille"][ligne][pos] === 0) {
            membersdico[user.id]["grille"][ligne][pos] = player;
            posed = true;
        } else {
            ligne -= 1;
        }
    }
    return [membersdico[user.id]["grille"], placements, ligne, pos];
}

function detect_victory_puissance_4(user, player, grille, posx, posy) {
    console.log("x : " + posx + " | y : " + posy);
    var victory = false;
    var count = 0;
    console.log("Player" + player);
    // COMPTER EN LIGNE
    for (let c = 0; c < 6; c++) {
        if (grille[posx][c] === player) {
            count += 1;
        } else {
            if (count < 4) {
                count = 0;
            }
        }
    }
    // COMPTER EN COLONNES
    for (let l = 0; l < 5; l++) {
        if (grille[l][posy] === player) {
            count += 1;
        } else {
            if (count < 4) {
                count = 0;
            }
        }
    }
    if (count >= 4) {
        user.send("C'est gagné");
        console.log("Gagné");
        console.log("Victoire :", player);
        return player;
    }
    user.send("C'est perdu");
    console.log("Victoire : 0");
    return 0;
}

function show_puissance_4(user, grille) {
    console.log(grille);
    var grille_to_send = "**La grille**";
    for (let i = 0; i < grille[0].length - 1; i++) {
        for (let j = 0; j < grille[i].length; j++) {
            if (j === 0) {
                grille_to_send += "\n";
            }
            if (grille[i][j] === 0) {
                grille_to_send += " :white_medium_small_square: ";
            } else if (grille[i][j] === 1) {
                grille_to_send += " :red_square: ";
            } else if (grille[i][j] === 2) {
                grille_to_send += " :blue_square: ";
            } else {
                grille_to_send += " :green_square: ";
            }
        }
    }
    grille_to_send +=
        "\n <:poll1:1017112408248041543>  <:poll2:1017113079869341818>  <:poll3:1017113080989221016>  <:poll4:1017113694854979674>  <:poll5:1017113696130060348>  <:poll6:1017113697166041108>  <:poll7:1017114267356504114>";
    user.send(grille_to_send);
}

init({ test: true, resetCommands:false });
db.update();