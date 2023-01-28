const { MessageReaction, User, EmbedBuilder } = require("discord.js");
const { client } = require("../client");

const db = require("../data/db");

/**
 * Check if the giveaway is finished and name the winner
 * @param {MessageReaction} [reaction] Reaction
 * @param {User} [user] User that reacted to the giveaway
 */
async function checkIfFinished(reaction, user) {
    if (reaction.message.author.bot) {
        if (await db.checkIfMessageIsGiveaway(reaction.message.id)) {
            const giveaway = await db.getGiveaway(reaction.message.id);
            if (giveaway.authorId === user.id && !giveaway.winner) {
                const participants = Array.from(
                    await (await reaction.users.fetch()).values()
                )
                    .map((user) =>
                        user.id === giveaway.authorId || user.bot ? null : user
                    )
                    .flat();

                const winner =
                    participants[
                        Math.floor(Math.random() * participants.length)
                    ];
                await reaction.message.fetch();

                const embed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(
                        `:moneybag: Tirage pour gagner **__${giveaway.title}__** terminé.`
                    )
                    .setDescription(
                        `Tirage au sort terminé, le gagnant est ${
                            winner ?? "personne ahah, fallait participer"
                        }`
                    );

                reaction.message.edit({ content: "", embeds: [embed] });

                if (winner) {
                    db.setGiveawayWinner(reaction.message.id, winner.id);
                    await winner.send(
                        `Vous venez de gagner le tirage au sort, vous gagnez **${giveaway.title}**`
                    );
                }
            }
        }
    }
}

module.exports = {
    checkIfFinished,
};
