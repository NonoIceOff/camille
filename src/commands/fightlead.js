const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

const db = require("../data/db");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    const winners = await db.getFightWinners(0, 25);

    var placesEmotes = [
        ":first_place:",
        ":second_place:",
        ":third_place:",
        ":four:",
        ":five:",
        ":six:",
        ":seven:",
        ":eight:",
        ":nine:",
        ":keycap_ten:",
    ];

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(
            ":crossed_swords:  **__Classement des gagnants de FIGHT DISCORD :__**"
        )
        .addFields(
            await Promise.all(
                winners.map(async (winner, i) => {
                    let username = `<!${winner.userId}>`;
                    if (winner.userId.startsWith("IA"))
                        username = winner.userId;
                    else {
                        const guildMember = await guild.members.fetch(
                            winner.userId
                        );
                        if (guildMember)
                            username =
                                guildMember.nickname ??
                                guildMember.user.username;
                    }
                    return {
                        name: `${placesEmotes[i]} **|** ${username}`,
                        value: " :star:".repeat(winner.wins),
                        inline: true,
                    };
                })
            )
        );

    interaction.reply({ embeds: [embed] });
}

const definition = new SlashCommandBuilder()
    .setName("fightlead")
    .setDescription("Classement des vainqueurs de Fight Discord.");

module.exports = {
    onTrigger,
    definition,
};
