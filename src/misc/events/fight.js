/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onButton(interaction) {
    // TODO: Rewrite
    if (interaction.isButton()) {
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
    }
}
