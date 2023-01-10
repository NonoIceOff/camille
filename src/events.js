const { Events } = require("discord.js");

const constantIDs = require("./constants/ids");

const { client, options } = require("./client");
const welcomeMessage = require("./misc/welcomeMessage");
const gamesCore = require("./games/core");
const bump = require("./misc/bump");
const xpSources = require("./xp/sources");
const roleMenu = require("./misc/roleMenu");
const giveaway = require("./misc/giveaway");
const commandsCore = require("./commands/core");

client.on(Events.ClientReady, async () => {
    if (false) {
        // TODO: Remake all of this
    adminrole = client.guilds.cache
        .get(guild_id)
        .roles.cache.get(constantIDs.roles.admin[test]);
    dreamteam = client.guilds.cache
        .get(guild_id)
        .roles.cache.get(constantIDs.roles.dreamTeam[test]);

    let votestart = new cron.CronJob("00 34 01 1 * *", startvote);
    votestart.start();
    let votestop = new cron.CronJob("00 00 00 2 * *", stopvote);
    votestop.start();
    let vidcheck = new cron.CronJob("00 00 20 * * *", newvid);
    vidcheck.start();
    let grades = new cron.CronJob("00 00 00 1 * *", givegrades);
    grades.start();
    }

    console.log("\x1b[32m", "Bot connecté ✓", "\x1b[0m");

    commandsCore.resetCommands();
});

client.on(Events.GuildMemberAdd, (member) => {
    welcomeMessage.sendWelcome(member);

    member.roles.add(constantIDs.roles.member[+options.test]); // Give the member role
});

client.on(Events.MessageCreate, async (message) => {
    gamesCore.onMessage(message);
    bump.bump(message);
    xpSources.fromMessage(message);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(error);
            return;
        }
    }

    roleMenu.addRole(reaction, user);
    giveaway.checkIfFinished(reaction, user);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(error);
            return;
        }
    }

    roleMenu.removeRole(reaction, user);
});

client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
    // Listeing to the voiceStateUpdate event
    let file = editJsonFile("./infos.json");
    var voicemember = file.get("voice");
    var number_voices = 0;

    if (newVoiceState.member.voice.channel != null) {
        number_voices = newVoiceState.member.voice.channel.members.size;
    }

    if (newVoiceState.member.voice.selfMute == false && number_voices > 1) {
        // SI PAS MUTE
        if (newVoiceState.channel) {
            // The member connected to a channel.
            if (!voicemember[newVoiceState.member.user.id]) {
                // Si conexxion simple
                start_voicetime_to_user(newVoiceState.member.user);
            } else {
                // Si changement de salon simple
                stop_voicetime_to_user(newVoiceState.member.user);
                start_voicetime_to_user(newVoiceState.member.user);
            }
        } else if (oldVoiceState.channel) {
            // The member disconnected from a channel.
            if (voicemember[newVoiceState.member.user.id]) {
                stop_voicetime_to_user(newVoiceState.member.user);
            }
        }
    } else {
        // SI MUTE
        stop_voicetime_to_user(newVoiceState.member.user);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    commandsCore.callCommand(interaction);
    
    if (interaction.isButton()) {
        let file2 = editJsonFile("./shop.json");
        var shopdico = file2.get("Members");

        let file = editJsonFile("./infos.json");
        var membersdico = file.get("members");

        let file3 = editJsonFile("./fight.json");
        var fightdico = file3.get("Saisons");

        if (interaction.customId === "fight_players") {
            if (fightdico[fightdico["Number"].toString()]["Joueurs"] === 4) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 8;
            } else if (
                fightdico[fightdico["Number"].toString()]["Joueurs"] === 8
            ) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 16;
            } else if (
                fightdico[fightdico["Number"].toString()]["Joueurs"] === 16
            ) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 32;
            } else if (
                fightdico[fightdico["Number"].toString()]["Joueurs"] === 32
            ) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 4;
            }
            file3.set("Saisons", fightdico);
            file3.save();
            embed_fight(interaction.message);
            interaction.deferUpdate();
        }

        if (interaction.customId === "fight_manches") {
            if (fightdico[fightdico["Number"].toString()]["ManchesQ"] === 3) {
                fightdico[fightdico["Number"].toString()]["ManchesQ"] = 5;
            } else if (
                fightdico[fightdico["Number"].toString()]["ManchesQ"] === 5
            ) {
                fightdico[fightdico["Number"].toString()]["ManchesQ"] = 3;
            }
            file3.set("Saisons", fightdico);
            file3.save();
            embed_fight(interaction.message);
            interaction.deferUpdate();
        }

        if (interaction.customId === "fight_victoire") {
            if (
                fightdico[fightdico["Number"].toString()]["Victoire"] ===
                "Points"
            ) {
                fightdico[fightdico["Number"].toString()]["Victoire"] = "Kills";
            } else if (
                fightdico[fightdico["Number"].toString()]["Victoire"] ===
                "Kills"
            ) {
                fightdico[fightdico["Number"].toString()]["Victoire"] =
                    "Points";
            }
            file3.set("Saisons", fightdico);
            file3.save();
            embed_fight(interaction.message);
            interaction.deferUpdate();
        }

        if (interaction.customId === "fight_launch") {
            fightdico[fightdico["Number"].toString()]["Inscriptions"] = [];
            file3.set("Saisons", fightdico);
            file3.save();
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("fight_inscriptions")
                    .setLabel("⚔️ INSCRIVEZ-VOUS")
                    .setStyle(ButtonStyle.Danger)
            );
            client.guilds.cache
                .get(guild_id)
                .channels.cache.get(
                    constantIDs.event.fightDiscord.channel[+options.test]
                )
                .send({
                    content:
                        "**FIGHT DISCORD SAISON " +
                        fightdico["Number"].toString() +
                        "** (" +
                        fightdico[fightdico["Number"].toString()][
                            "Inscriptions"
                        ].length.toString() +
                        "/" +
                        fightdico[fightdico["Number"].toString()][
                            "Joueurs"
                        ].toString() +
                        ")",
                    components: [row],
                });

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("fight_start")
                    .setLabel("⚔️ Lancer la saison")
                    .setStyle(ButtonStyle.Danger)
            );

            interaction.user.send({
                content:
                    "**FIGHT DISCORD SAISON " +
                    fightdico["Number"].toString() +
                    "**",
                components: [row2],
            });

            interaction.deferUpdate();
        }

        if (interaction.customId === "fight_inscriptions") {
            if (
                fightdico[fightdico["Number"].toString()][
                    "Inscriptions"
                ].includes(interaction.user.id) == false
            ) {
                fightdico[fightdico["Number"].toString()]["Inscriptions"].push(
                    interaction.user.id
                );
                file3.set("Saisons", fightdico);
                file3.save();
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("fight_inscriptions")
                        .setLabel("⚔️ INSCRIVEZ-VOUS")
                        .setStyle(ButtonStyle.Danger)
                );
                interaction.message.edit({
                    content:
                        "**FIGHT DISCORD SAISON " +
                        fightdico["Number"].toString() +
                        "** (" +
                        fightdico[fightdico["Number"].toString()][
                            "Inscriptions"
                        ].length.toString() +
                        "/" +
                        fightdico[fightdico["Number"].toString()][
                            "Joueurs"
                        ].toString() +
                        ")",
                    components: [row],
                });
            }
            interaction.deferUpdate();
        }

        if (interaction.customId === "fight_start") {
            var ia_nbr = 0;
            while (
                fightdico[fightdico["Number"].toString()]["Inscriptions"]
                    .length <
                fightdico[fightdico["Number"].toString()]["Joueurs"]
            ) {
                ia_nbr += 1;
                fightdico[fightdico["Number"].toString()]["Inscriptions"].push(
                    "IA" + ia_nbr.toString()
                );
                file3.set("Saisons", fightdico);
                file3.save();
            }

            ia_nbr = 0;
            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle("**Saison 1 de Fight Discord**")
                .setDescription(
                    "*Voici le tableau des joueurs, qui joueront dans cette saison.*"
                )
                .setFooter({
                    text: "Lancement dans 1h - avec intervale de 10 mins.",
                });
            var max = fightdico[fightdico["Number"].toString()]["Joueurs"];
            var text = "";
            var text2 = "";
            var text3 = "";
            var text4 = "";
            for (let i = 0; i < max; i++) {
                if (
                    fightdico[fightdico["Number"].toString()]["Inscriptions"][
                        i
                    ].includes("IA") == false
                ) {
                    user = await client.users.fetch(
                        fightdico[fightdico["Number"].toString()][
                            "Inscriptions"
                        ][i]
                    );
                    if (i >= 0 && i < 10) {
                        text += "**" + user.username + "** *(Joueur)*\n";
                    } else if (i >= 10 && i < 20) {
                        text2 += "**" + user.username + "** *(Joueur)*\n";
                    } else if (i >= 20 && i < 30) {
                        text3 += "**" + user.username + "** *(Joueur)*\n";
                    } else if (i >= 30 && i < 32) {
                        text4 += "**" + user.username + "** *(Joueur)*\n";
                    }
                } else {
                    ia_nbr += 1;
                    if (i >= 0 && i < 10) {
                        text += "**IA" + ia_nbr.toString() + "** *(IA)*\n";
                    } else if (i >= 10 && i < 20) {
                        text2 += "**IA" + ia_nbr.toString() + "** *(IA)*\n";
                    } else if (i >= 20 && i < 30) {
                        text3 += "**IA" + ia_nbr.toString() + "** *(IA)*\n";
                    } else if (i >= 30 && i < 32) {
                        text4 += "**IA" + ia_nbr.toString() + "** *(IA)*\n";
                    }
                }
            }
            exampleEmbed.addFields({
                name: "1-10",
                value: text,
                inline: true,
            });
            if (text2 != "") {
                exampleEmbed.addFields({
                    name: "11-20",
                    value: text2,
                    inline: true,
                });
            }
            if (text3 != "") {
                exampleEmbed.addFields({
                    name: "21-30",
                    value: text3,
                    inline: true,
                });
            }
            if (text4 != "") {
                exampleEmbed.addFields({
                    name: "31-32",
                    value: text4,
                    inline: true,
                });
            }
            client.guilds.cache
                .get(guild_id)
                .channels.cache.get(
                    constantIDs.event.fightDiscord.channel[+options.test]
                )
                .send({ embeds: [exampleEmbed] });
            start_fight_qualifs();
            interaction.deferUpdate();
        }
        if (interaction.customId === "coucou") {
            interaction.reply(
                "<@" + interaction.user.id + "> te fais un coucou !"
            );
        }
        if (interaction.customId === "shop_dreamteam") {
            if (membersdico[interaction.user.id]["esheep"] >= 220) {
                interaction.reply(
                    "Dream Team acheté avec succès. (-220:coin:)"
                );
                shopdico[interaction.user.id]["Grades"][0] += 1;
                membersdico[interaction.user.id]["esheep"] -= 220;
                file2.set("Members", shopdico);
                file2.save();
                file.set("members", membersdico);
                file.save();
            } else {
                interaction.reply("Echec. Vous n'avez pas assez de :coin:");
            }
        }
        if (interaction.customId === "shop_dreamteam+") {
            if (membersdico[interaction.user.id]["esheep"] >= 467) {
                interaction.reply(
                    "Dream Team + acheté avec succès. (-467:coin:)"
                );
                shopdico[interaction.user.id]["Grades"][1] += 1;
                membersdico[interaction.user.id]["esheep"] -= 467;
                file2.set("Members", shopdico);
                file2.save();
                file.set("members", membersdico);
                file.save();
            } else {
                interaction.reply("Echec. Vous n'avez pas assez de :coin:");
            }
        }
        if (interaction.customId === "shop_superdreamteam") {
            if (membersdico[interaction.user.id]["esheep"] >= 1182) {
                interaction.reply(
                    "Super Dream Team acheté avec succès. (-1182:coin:)"
                );
                shopdico[interaction.user.id]["Grades"][2] += 1;
                membersdico[interaction.user.id]["esheep"] -= 1182;
                file2.set("Members", shopdico);
                file2.save();
                file.set("members", membersdico);
                file.save();
            } else {
                interaction.reply("Echec. Vous n'avez pas assez de :coin:");
            }
        }
        if (interaction.customId === "pierre_button") {
            game_pfc(interaction.user, 1);
            interaction.deferUpdate();
        }
        if (interaction.customId === "feuille_button") {
            game_pfc(interaction.user, 2);
            interaction.deferUpdate();
        }
        if (interaction.customId === "ciseaux_button") {
            game_pfc(interaction.user, 3);
            interaction.deferUpdate();
        }
        if (interaction.customId === "pfc_rematch") {
            game_pfc(interaction.user, 1);
        }
        if (interaction.customId === "jp_rematch") {
            game_jp(interaction.user);
        }
        if (interaction.customId === "xplead_+") {
            xp_lead(2, interaction);
        }
        if (interaction.customId === "xplead_-") {
            xp_lead(1, interaction);
        }
    }
});
