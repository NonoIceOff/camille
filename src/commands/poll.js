const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { client, options } = require("../client");
const constantIDs = require("../constants/ids");

/**
 * Action when the command is triggered
 * @param {ChatInputCommandInteraction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    if (interaction.member.roles.cache.has(constantIDs.roles.dreamTeam[+options.test])) {
        const emotes = [
            "<:poll1:1017112408248041543>",
            "<:poll2:1017113079869341818>",
            "<:poll3:1017113080989221016>",
            "<:poll4:1017113694854979674>",
            "<:poll5:1017113696130060348>",
            "<:poll6:1017113697166041108>",
            "<:poll7:1017114267356504114>",
            "<:poll8:1017114268564463626>",
            "<:poll9:1017114270120562728>",
            "<:poll10:1017114271437553815>",
        ];

        var pollOptions = interaction.options.data
            .filter((option) => option.name != "title")
            .map((option) => {
                option.name = option.name.substring(6);
                return option;
            })
            .sort((a, b) => a.name - b.name)
            .map((option, i) => `${emotes[i]} ${option.value}`);

        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(
                `:bar_chart: **__${interaction.options.getString("title")}__**`
            )
            .setDescription(pollOptions.join("\n"));
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });
        
        pollOptions.forEach(async (_,i)=> {
            await message.react(emotes[i]);
        });
        
        await message.channel.send(
            `<:pollup:1017130270979264602> <:pollup:1017130270979264602> <@&${constantIDs.roles.notifPoll[+options.test]}>`
        );
    } else {
        interaction.reply(
            `Vous n'avez pas le rôle **${
                client.guilds.cache
                    .get(constantIDs.workingGuild[+options.test])
                    .roles.cache.get(constantIDs.roles.dreamTeam[+options.test])
                    .name
            }** pour executer cette commande.`
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Lancer un sondage")
    .addStringOption((titre) =>
        titre
            .setName("title")
            .setDescription("Le titre du sondage")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("option1").setDescription("Réponse 1").setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("option2").setDescription("Réponse 2").setRequired(true)
    );

for (let i = 3; i <= 10; i++) {
    definition.addStringOption((option) =>
        option
            .setName("option" + i)
            .setDescription("Réponse " + i)
            .setRequired(false)
    );
}

module.exports = {
    onTrigger,
    definition,
};
