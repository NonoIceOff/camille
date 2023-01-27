const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

const gameComponents = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("game/rockPaperScissors/play/0")
            .setLabel("🗿 Pierre")
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId("game/rockPaperScissors/play/1")
            .setLabel("🧻 Feuille")
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId("game/rockPaperScissors/play/2")
            .setLabel("✂️ Ciseaux")
            .setStyle(ButtonStyle.Secondary)
    );

class rockPaperScissors {
    get name() {
        return "rockPaperScissors";
    }

    /**
     * @param {User} user
     */
    constructor(user) {
        this.user = user;
        this.start();
    }
    async start() {
        this.round = 0;
        this.wonRounds = 0;
        this.gain = 0;

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Pierre Feuille Ciseaux__**")
            .setDescription(
                "Il faut savoir que je choisis mon objet quand la manche démarre, pas de soucis à se faire !."
            );
        await this.user.send({ embeds: [embed], components: [gameComponents] });
    }

    /**
     * Triggered when a button is pressed
     * @param {import("discord.js").Interaction} [interaction] THE interaction
     * @param {Array<String>} [path] Path of the interaction
     */
    async onButton(interaction, path) {
        await interaction.deferUpdate();
        if (path[2] === "play") {
            const items = ["Pierre", "Feuille", "Ciseaux"];
            const botItem = Math.floor(Math.random() * 3);

            if (path[3] == botItem) {
                this.user.send(
                    `Oh bah c'est marrant, on a le même objet ${
                        items[path[3]]
                    }.`
                );
            } else {
                if (
                    path[3] > botItem ||
                    (path[3] + 1) % 3 > (botItem + 1) % 3
                ) {
                    this.user.send(
                        `**${items[path[3]]}** contre **${
                            items[botItem]
                        }**, vous avez gagné cette manche.`
                    );
                    this.wonRounds++;
                    this.gain += 0.3;
                } else {
                    this.user.send(
                        `**${items[path[3]]}** contre **${
                            items[botItem]
                        }**, vous avez perdu cette manche.`
                    );
                }
                this.round++;
            }

            if (this.round > 5) {
                const embed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(
                        this.wonRounds >= 3
                            ? ":tada: **__Félicitations__**"
                            : ":cry:  **__Mince...__**"
                    )
                    .setDescription(
                        `${
                            this.wonRounds >= 3
                                ? "Vous m'avez battu dans cette partie"
                                : "Vous m'avez pas battu dans cette partie"
                        }. Vous avez remporté ${this.wonRounds} ${
                            this.wonRounds >= 3
                                ? "manches c'est ENORME !"
                                : "manches contre 3 requises."
                        }`
                    )
                    .addFields({
                        name: "Gains récupérés",
                        value: `${this.gain} :coin:`,
                    });
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("game/rockPaperScissors/restart")
                        .setLabel("REJOUER (marche pas trop)")
                        .setStyle(ButtonStyle.Danger)
                );
                this.user.send({ embeds: [embed] });

                this.user.addCoin(this.gain);
            }else{
                this.user.send({
                    content: "___\n**NOUVELLE MANCHE**\n",
                    components: [gameComponents],
                });
            }
        } else if (path[2] === "restart") {
            this.start();
        }
    }
}

module.exports = rockPaperScissors;