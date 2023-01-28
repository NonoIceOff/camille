const {
    User,
    Message,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

class streetFairPrice {
    get name() {
        return "streetFairPrice";
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
        this.gain = 1.6;
        this.lastNumber = undefined;

        await this.user.send({
            content:
                "Wesh, bienvnue dans l'Juste Prix wesh, devine un nombre wesh (Entre 1 et 1000 wesh)",
        });
    }
    /**
     * @param {Message} message
     */
    async onMessage(message) {
        const restart_row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("game/streetFairPrice/restart")
                .setLabel("REJOUER")
                .setStyle(ButtonStyle.Danger)
        );

        if (!this.price) {
            this.user.send({
                content:
                    "Mais wesh... On est pas en jeu là wesh, faut jouer avant de dire un truc wesh...",
            });
        }

        let number = message.content;

        if (isNaN(number)) {
            await this.user.send({ content: "C'est pas un nombre ça wesh 🤣" });
            return;
        }

        if (number < 1 || number > 1000) {
            await this.user.send({
                content:
                    "J'ai dit entre 1 et 1000 wesh, t'es pas le couteau le plus aiguisé du tiroire toi wesh...",
            });
            return;
        }

        this.tests++;
        if (number == this.price) {
            this.price = undefined;
            this.gain = Math.floor(this.gain * 10) / 10;

            this.user.addCoin(this.gain);

            await this.user.send({
                components: [restart_row],
                content: `
Omg wesh, t'as trouvé l'bon nombre en ${this.tests} essais wesh, gg en fait wesh !

+${this.gain} :coin:

Si tu veux tu peux recommencer wesh`,
            });

            return;
        } else {
            if (this.gain > 0) this.gain -= 0.1;
            if (this.tests >= 5) {
                this.price = undefined;

                await this.user.send({
                    components: [restart_row],
                    content:
                        "C'est perdu wesh, t'es trop nul wesh 🤣\n\nSi tu veux tu peux recommencer wesh",
                });
                return;
            }

            if (number > this.price) {
                if (number > this.lastNumber && this.lastNumber > this.price) {
                    await this.user.send({
                        content:
                            "Mais wesh... T'es con ? J'AI DIT MOINS WESH !",
                    });
                } else {
                    await this.user.send({ content: "Moins wesh" });
                }
            } else {
                if (number < this.lastNumber && this.lastNumber < this.price) {
                    await this.user.send({
                        content: "Mais wesh... T'es con ? J'AI DIT PLUS WESH !",
                    });
                } else {
                    await this.user.send({ content: "Plus wesh" });
                }
            }
        }

        this.lastNumber = number;
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

module.exports = streetFairPrice;
