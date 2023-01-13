const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    if (interaction.member.roles.cache.has(dreamteam.id) === true) {
        var descr =
            "<:poll1:1017112408248041543> " +
            interaction.options.getString("option1");
        descr +=
            "\n<:poll2:1017113079869341818> " +
            interaction.options.getString("option2");

        if (interaction.options.getString("option3") != null) {
            descr +=
                "\n<:poll3:1017113080989221016> " +
                interaction.options.getString("option3");
        }
        if (interaction.options.getString("option4") != null) {
            descr +=
                "\n<:poll4:1017113694854979674> " +
                interaction.options.getString("option4");
        }
        if (interaction.options.getString("option5") != null) {
            descr +=
                "\n<:poll5:1017113696130060348> " +
                interaction.options.getString("option5");
        }
        if (interaction.options.getString("option6") != null) {
            descr +=
                "\n<:poll6:1017113697166041108> " +
                interaction.options.getString("option6");
        }
        if (interaction.options.getString("option7") != null) {
            descr +=
                "\n<:poll7:1017114267356504114> " +
                interaction.options.getString("option7");
        }
        if (interaction.options.getString("option8") != null) {
            descr +=
                "\n<:poll8:1017114268564463626> " +
                interaction.options.getString("option8");
        }
        if (interaction.options.getString("option9") != null) {
            descr +=
                "\n<:poll9:1017114270120562728> " +
                interaction.options.getString("option9");
        }
        if (interaction.options.getString("option10") != null) {
            descr +=
                "\n<:poll10:1017114271437553815> " +
                interaction.options.getString("option10");
        }
        const embed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(
                ":bar_chart: **__" +
                    interaction.options.getString("titre") +
                    "__**"
            )
            .setDescription(descr);
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true,
        });
        message.react("<:poll1:1017112408248041543>");
        message.react("<:poll2:1017113079869341818>");
        if (interaction.options.getString("option3") != null) {
            message.react("<:poll3:1017113080989221016>");
        }
        if (interaction.options.getString("option4") != null) {
            message.react("<:poll4:1017113694854979674>");
        }
        if (interaction.options.getString("option5") != null) {
            message.react("<:poll5:1017113696130060348>");
        }
        if (interaction.options.getString("option6") != null) {
            message.react("<:poll6:1017113697166041108>");
        }
        if (interaction.options.getString("option7") != null) {
            message.react("<:poll7:1017114267356504114>");
        }
        if (interaction.options.getString("option8") != null) {
            message.react("<:poll8:1017114268564463626>");
        }
        if (interaction.options.getString("option9") != null) {
            message.react("<:poll9:1017114270120562728>");
        }
        if (interaction.options.getString("option10") != null) {
            message.react("<:poll10:1017114271437553815>");
        }
        message.channel.send(
            "<:pollup:1017130270979264602> <:pollup:1017130270979264602> <@&940294485940781177>"
        );
    } else {
        interaction.reply(
            "Vous n'avez pas le rôle **" +
                dreamteam.name +
                "** pour executer cette commande."
        );
    }
}

const definition = new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Lancer un sondage")
    .addStringOption((titre) =>
        titre
            .setName("titre")
            .setDescription("Le titre du sondage")
            .setRequired(true)
    )
    .addStringOption((option1) =>
        option1.setName("option1").setDescription("Réponse 1").setRequired(true)
    )
    .addStringOption((option2) =>
        option2.setName("option2").setDescription("Réponse 2").setRequired(true)
    )
    .addStringOption((option3) =>
        option3
            .setName("option3")
            .setDescription("Réponse 3")
            .setRequired(false)
    )
    .addStringOption((option4) =>
        option4
            .setName("option4")
            .setDescription("Réponse 4")
            .setRequired(false)
    )
    .addStringOption((option5) =>
        option5
            .setName("option5")
            .setDescription("Réponse 5")
            .setRequired(false)
    )
    .addStringOption((option6) =>
        option6
            .setName("option6")
            .setDescription("Réponse 6")
            .setRequired(false)
    )
    .addStringOption((option7) =>
        option7
            .setName("option7")
            .setDescription("Réponse 7")
            .setRequired(false)
    )
    .addStringOption((option8) =>
        option8
            .setName("option8")
            .setDescription("Réponse 8")
            .setRequired(false)
    )
    .addStringOption((option9) =>
        option9
            .setName("option9")
            .setDescription("Réponse 9")
            .setRequired(false)
    )
    .addStringOption((option10) =>
        option10
            .setName("option10")
            .setDescription("Réponse 10")
            .setRequired(false)
    );

module.exports = {
    onTrigger,
    definition,
};
