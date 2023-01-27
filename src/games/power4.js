// TODO: Rewrite entire game

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

/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 */
 function onButton(interaction,path) {

}