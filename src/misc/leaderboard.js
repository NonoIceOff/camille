const {
    EmbedBuilder,
    GuildMember,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");
const { client, options } = require("../client");
const constantIDs = require("../constants/ids");
const { getTopUserValue, getUserCount } = require("../data/db");
const { xpToLevelData } = require("../xp/utils");
const { toTimeFormat } = require("../utils/date");
const { ButtonBuilder } = require("@discordjs/builders");

const leaderboardValues = {
    xp: {
        title: ":roll_of_paper:  **__Classement de l'xp :__**",
        description:
            "Vous n'avez rien a gagner d'être premier, mais attention cela n'empêche pas de flex un max !",
        value: (xp) => {
            const levelData = xpToLevelData(xp);
            return `**Niveau ${levelData.level}** *(${levelData.levelXp}/${levelData.levelupXp})*`;
        },
    },
    monthly_bump: {
        title: ":bellhop: __**Classement des bumps du mois**__",
        description:
            "Chaque bump effectué vous fera **gagner 150 xp**, c'est beaucoup mais c'est mérité car cela avance le serveur !",
        value: (bump) => `${bump} bumps`,
    },
    coin: {
        title: ":trophy: **__Classement de l'économie :__**",
        description:
            "Ces fameux coins qui s'obtiennent avec de l'xp, avec cette conversion (1xp = 0.1 :coin:). Très utile avec le /shop.",
        value: (coin) => `**${Math.floor(coin * 100) / 100}** :coin:`,
    },
    voice: {
        title: ":microphone:  **__Classement du temps de vocal :__**",
        description:
            "Le classement du temps de vocal (all-time) qui ne sert qu'à flex pour l'instant. La minute de vocal en n'étant pas seul et pas mute, vous rapporte **5 xp**",
        value: (voice) => `**${toTimeFormat(voice, true, true, true, true)}**`,
    },
};

/**
 * Edit an interaction reply to a leaderboard
 * @param {import("discord.js").Interaction} interaction THE interaction
 * @param {string} value Name of the value to make the leaderboard. Look at `data/constants/userValuesName` to get the list of values.
 * @param {number} page Page number
 */
async function editLeaderboard(interaction, value, page) {
    const leaderboard = await getTopUserValue(value, (page - 1) * 9, 9);
    const pageCount = Math.ceil((await getUserCount()) / 9);

    var placeName = [":first_place:", ":second_place:", ":third_place:"];

    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(leaderboardValues[value].title)
        .setDescription(leaderboardValues[value].description)
        .setFooter({
            text: `Page ${page} / ${pageCount}`,
        })
        .setFields(
            await Promise.all(
                leaderboard.map(async (userValue, index) => {
                    const place = index + (page - 1) * 9;

                    const workingGuild = client.guilds.cache.get(
                        constantIDs.workingGuild[+options.test]
                    );

                    let user = workingGuild.members.cache.get(userValue);
                    if (!user) {
                        try {
                            user = await workingGuild.members.fetch(
                                userValue.userId
                            );
                        } catch {
                            user = client.users.cache.get(userValue.userId);
                            if (!user) {
                                try {
                                    await client.users.fetch(userValue.userId);
                                } catch {}
                            }
                        }
                    }
                    if (
                        user
                            ? !user.username && user.user
                                ? !user.user.username
                                : true
                            : true
                    ) {
                        user = { nickname: `<!${userValue.userId}>` };
                    }

                    return {
                        name: `${place <= 2 ? placeName[place] : place + 1} | ${
                            user.nickname ??
                            (user.user ? user.user.username : user.username)
                        }`,
                        value: leaderboardValues[value].value(userValue.value),
                        inline: true,
                    };
                })
            )
        );

    const components = new ActionRowBuilder();
    if (page > 1)
        components.addComponents(
            new ButtonBuilder()
                .setCustomId(`leaderboard/${value}/${page - 1}`)
                .setLabel("⏪")
                .setStyle(ButtonStyle.Secondary)
        );
    if (page < pageCount)
        components.addComponents(
            new ButtonBuilder()
                .setCustomId(`leaderboard/${value}/${page + 1}`)
                .setLabel("⏩")
                .setStyle(ButtonStyle.Secondary)
        );

    interaction.editReply({
        content: "",
        embeds: [embed],
        components: [components],
    });
}

/**
 * Triggered when a button is pressed
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onButton(interaction) {
    if (interaction.isButton()) {
        let path = interaction.customId.split("/");
        if (path[0] === "leaderboard") {
            if (
                interaction.message.interaction.user.id === interaction.user.id
            ) {
                interaction.deferUpdate();
                editLeaderboard(interaction, path[1], +path[2]);
            }else{
                interaction.reply({content:"Bah non, c'est pas ton classement, ouvre en un toi-même si tu veux l'utiliser",ephemeral:true});
            }
        }
    }
}

module.exports = {
    editLeaderboard,
    onButton,
};
