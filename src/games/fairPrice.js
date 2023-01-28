const {
    User,
    Message,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");

class fairPrice {
    get name() {
        return "fairPrice";
    }

    /**
     * @param {User} user
     */
    constructor(user) {
        this.user = user;
        this.start();
    }
    async start() {
        this.tests = 0;
        this.price = Math.floor(Math.random() * 1000) + 1;
        this.gain = 1.8;

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Juste Prix__**")
            .setDescription(
                "Veuillez entrer un nombre entre 1 et 1000 sur le tchat."
            );
        await this.user.send({ embeds: [embed] });
    }
    /**
     * @param {Message} message
     */
    async onMessage(message) {
        const restart_row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("game/fairPrice/restart")
                .setLabel("REJOUER")
                .setStyle(ButtonStyle.Danger)
        );

        if (!this.price) {
            this.user.send({
                content: "Veuillez lancer le jeu avant d'essayer de jouer.",
            });
        }

        let number = message.content;

        if (isNaN(number)) {
            await this.user.send(
                "Veuillez plutôt entrer un nombre entre 1 et 1000 s'il vous plait. (erreur : N'est pas un nombre)"
            );
            return;
        }

        if (number < 1 || number > 1000) {
            await this.user.send(
                "Veuillez plutôt entrer un nombre entre 1 et 1000 s'il vous plait. (erreur : N'est pas un nombre entre 1 et 1000 du coup)"
            );
            return;
        }

        this.tests++;
        if (number == this.price) {
            this.user.addCoin(this.gain);

            const embed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle(":tada: **__Félicitations__**")
                .setDescription(
                    `Vous avez trouvé le nombre ${this.price} en ${this.tests} essais.`
                )
                .addFields({
                    name: "Gains récupérés",
                    value: `${this.gain} :coin:`,
                });

            this.price = undefined;

            await this.user.send({
                embeds: [embed],
                components: [restart_row],
            });

            return;
        } else {
            if (this.gain > 0)
                this.gain = Math.floor((this.gain - 0.1) * 10) / 10;
            if (this.tests >= 15) {
                const embed = new EmbedBuilder()
                    .setColor(2171330)
                    .setTitle(":tada: **__Perdu ( ˘︹˘ )__**")
                    .setDescription(
                        `Vous n'avez pas trouvé le nombre ${this.price} en 15 essais.`
                    )
                    .addFields({
                        name: "Gains récupérés",
                        value: `Bah 0 du coup :coin:`,
                    });

                this.price = undefined;

                await this.user.send({
                    embeds: [embed],
                    components: [restart_row],
                });
                return;
            }

            if (number > this.price) {
                await this.user.send(`
**Plus petit...**
Vous êtes à ${this.tests} essais. *En jeu : ${this.gain} :coin:*`);
            } else {
                await this.user.send(`
**Plus grand...**
Vous êtes à ${this.tests} essais. *En jeu : ${this.gain} :coin:*`);
            }
        }
    }
    /**
     * Triggered when a button is pressed
     * @param {import("discord.js").Interaction} [interaction] THE interaction
     * @param {Array<String>} [path] Path of the interaction
     */
    async onButton(interaction, path) {
        if (path[2] === "restart") {
            await interaction.deferUpdate();
            this.start();
        }
    }
}

module.exports = fairPrice;
