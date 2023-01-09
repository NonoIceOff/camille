const { GuildMember } = require("discord.js/src/structures/GuildMember");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const { client, options } = require("../client");
const constantIDs = require("../constants/ids");

const helloMessages = [
    "J'espère que tu as bien posé tes valises",
    "Tu es au bon endroit !",
    "Attention à Rémi, il est dangereux mdr",
    "UN MAX D'APPLAUDISSEMENTS :clap:",
    "Quel bonbon est toujours blasé ? Le choco-las",
    "On m'a demandé d'écrire un message de bienvenue, sauf que j'ai la flemme.",
    "Tu est tombé au bon endroit.",
    "Si Foxus ne te dit pas bienvenue dans les 5 minutes, il aura le seum.",
    "Oui, ceci est bien un message de bienvenue",
    "Aladin débarque pour vous donner du bifle!",
    "Connaissez-vous Twitch Prime ?",
    "C'est bien une des premières étapes pour battre carakle (triple champion du monde de Fight).",
    "Y'a aucun soucis si personne ne te dit bienvenue dès maintenant, c'est soit ils dorment soit ils dorment.",
    "Solo, tête sous l'eau, j'me suis dit, C'est l'moment mets l'fire ! Fire",
    "Tu viens d'emprunter le téléporteur mystère et es tombé dans le serveur",
];

/**
 * Send a welcome message in the welcome channel
 * @param {GuildMember} [member] Member to welcome
 * @example
 * sendWelcome(member)
 */
function sendWelcome(member) {
    if (member.guild.id === constantIDs.workingGuild[+options.test]) {
        var helloMessagesIndex = Math.floor(
            Math.random() * helloMessages.length
        );
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("coucou")
                .setLabel("👋 Fais coucou !")
                .setStyle(ButtonStyle.Danger)
        );
        client.guilds.cache
            .get(constantIDs.workingGuild[+options.test])
            .channels.cache.get(
                constantIDs.channels.welcomeChannel[+options.test]
            )
            .send({
                content:
                    "**<@" +
                    member.id +
                    "> bienvenue !** " +
                    helloMessages[helloMessagesIndex],
                components: [row],
            });
    }
}

module.exports = {
    sendWelcome,
};
