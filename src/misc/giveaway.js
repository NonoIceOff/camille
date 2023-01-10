const { MessageReaction, User } = require("discord.js");

/**
 * Check if the giveaway is finished and name the winner
 * @param {MessageReaction} [reaction] Reaction
 * @param {User} [user] User that reacted to the giveaway
 * @example
 * checkIfFinished(reaction, user)
 */
async function checkIfFinished(reaction, user) {
    // TODO: Remake this function with new DB

    if (reaction.message.author.bot) {
        if (reaction.message.embeds.length >= 1) {
            if (
                reaction.message.embeds[0]["data"]["title"].startsWith(
                    ":moneybag:"
                ) === true
            ) {
                var config = require("./infos.json");
                let file = editJsonFile("./infos.json");
                var tirages_dic = file.get("tirages");
                var members_dic = file.get("members");

                if (tirages_dic[reaction.message.id]) {
                    if (!tirages_dic[reaction.message.id]["participate"]) {
                        tirages_dic[reaction.message.id]["participate"] = [];
                    }

                    if (
                        !user.bot &&
                        user.id != tirages_dic[reaction.message.id]["author"]
                    ) {
                        tirages_dic[reaction.message.id]["participate"].push(
                            user.id
                        );
                    }

                    if (user.id == tirages_dic[reaction.message.id]["author"]) {
                        var gagnant_index = Math.floor(
                            Math.random() *
                                tirages_dic[reaction.message.id]["participate"]
                                    .length
                        );

                        var gagnant_id =
                            tirages_dic[reaction.message.id]["participate"][
                                gagnant_index
                            ].toString();

                        var prediction =
                            await reaction.message.channel.messages.fetch(
                                reaction.message.id
                            );

                        var messagepredi = reaction.message.embeds;

                        messagepredi[0]["data"]["description"] =
                            messagepredi[0]["data"]["description"].replace(
                                "Tirage au sort dès que l'auteur réponde.",
                                "Tirage au sort terminé, le gagnant est <@" +
                                    gagnant_id +
                                    ">"
                            );

                        const exampleEmbed = new EmbedBuilder()
                            .setColor(10181046)
                            .setTitle(messagepredi[0]["data"]["title"])
                            .setDescription(
                                messagepredi[0]["data"]["description"]
                            );

                        prediction.edit({
                            embeds: [exampleEmbed],
                            fetchReply: true,
                        });

                        if (gagnant_id != undefined) {
                            gagnant_user = client.users.cache.find(
                                (user) => user.id === gagnant_id
                            );
                            await gagnant_user.send(
                                "Vous venez de gagner le tirage au sort, vous gagnez **" +
                                    tirages_dic[reaction.message.id][
                                        "present"
                                    ].toString() +
                                    "**"
                            );
                        }
                        delete tirages_dic[reaction.message.id];
                    }
                    file.set("tirages", tirages_dic);
                    file.save();
                }
            }
        }
    }
}

module.exports = {
    checkIfFinished,
};
