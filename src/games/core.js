const { Message, User, RateLimitError } = require("discord.js");

const games = {
    fairPrice: require("./fairPrice"),
    streetFairPrice: require("./streetFairPrice"),
    //power4: require("./power4"),
    //rockPaperScissors: require("./rockPaperScissors"),
};

let playingGames = {};

/**
 * Init a game.
 * @param {User} [user]
 * @param {string} [game]
 */
function init(user, game) {
    if (games[game]) {
        playingGames[user.id] = new games[game](user);
    }else{
        user.send({content:`Déso, le jeu \`${game}\` n'est pas encore implémenté, ça arrivera un jour 🤞`});
    }
}

/**
 * Call the `onMessage` function for the current game of the message author.
 * @param {Message} [message] Message
 */
function onMessage(message) {
    if (!message.guild && !message.author.bot) {
        if (playingGames[message.author.id]) playingGames[message.author.id].onMessage(message);
    }
}

/**
 * Call the `onButton` and `onSelectMenu`
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onInteraction(interaction) {
    if (!interaction.guild && !interaction.isChatInputCommand()) {
        let path = interaction.customId.split("/");
        if (path[0] === "game") {
            if (!playingGames[interaction.user.id]) {
                interaction.reply({content:"Alors... Joue à un jeu déjà, après on vera si tu peux jouer.",ephemeral:true});

                return;   
            }
            if (playingGames[interaction.user.id].name == path[1]) {
                if (interaction.isButton()) {
                    playingGames[interaction.user.id].onButton(interaction, path);
                } else if (interaction.isSelectMenu()) {
                    playingGames[interaction.user.id].onSelectMenu(interaction, path);
                }
            }else{
                interaction.reply({content:"Heu... Je crois que tu peux pas faire ça, pas sûr, mais on me dit dans l'oreillette que c'est un jeu auquel tu jouais avant.",ephemeral:true});
            }
        }
    }
}

module.exports = {
    init,
    onMessage,
    onInteraction,
};