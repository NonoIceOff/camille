const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
function trigger(interaction) {
    // TODO: Make it working
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("members");
    var bumpdico = file.get("bump");
    var voicedico = file.get("voice");
    var max_xp_to_level = -1;
    var result = "Non enregistré";
    var niveau = "Non enregistré";
    var xp = "Non enregistré";
    var monnaie = "Non enregistré";
    var nbrbump = "Non enregistré";
    var nbrbumpm = "Non enregistré";
    if (!membersdico[interaction.member.id]) {
        membersdico[interaction.member.id] = {
            xp_total: 0,
            xp: 0,
            niveau: 0,
            esheep: 0,
            bumpstotal: 0,
        };
    }
    if (!voicedico[interaction.member.id]) {
        voicedico[interaction.member.id] = 0;
    }
    if (membersdico[interaction.member.id]) {
        niveau = membersdico[interaction.member.id]["niveau"];
        xp = membersdico[interaction.member.id]["xp"];
        monnaie =
            Math.round(membersdico[interaction.member.id]["esheep"] * 1000) /
            1000;
        max_xp_to_level =
            5 * Math.pow(membersdico[interaction.member.id]["niveau"], 2) +
            50 * membersdico[interaction.member.id]["niveau"] +
            100;
        nbrbump = membersdico[interaction.member.id]["bumpstotal"];
    }
    if (bumpdico[interaction.member.id]) {
        nbrbumpm = bumpdico[interaction.member.id];
    }
    if (voicedico["members_leaderboard"][interaction.member.id]) {
        var date = new Date(null);
        date.setSeconds(
            voicedico["members_leaderboard"][interaction.member.id]
        ); // specify value for SECONDS here
        result = date.toISOString().substr(11, 8);
    }
    file.set("members", membersdico);
    file.set("voice", voicedico);
    file.save();

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(
            ":desktop:  __**Statistiques de " +
                interaction.member.displayName +
                "**__"
        )
        .setDescription("Toutes vos statisques, au même endroit, c'est ICI.")
        .addFields(
            {
                name: "Niveau :",
                value:
                    "**" + niveau + "** (" + xp + "/" + max_xp_to_level + ")",
                inline: true,
            },
            {
                name: "Monnaie :",
                value: "**" + monnaie + "** :coin:",
                inline: true,
            },
            {
                name: "Temps en vocal :",
                value: "**" + result.toString() + "**",
                inline: true,
            },
            {
                name: "Bumps (all time) :",
                value: "**" + nbrbump.toString() + "**",
                inline: true,
            },
            {
                name: "Bumps (ce mois-ci) :",
                value: "**" + nbrbumpm.toString() + "**",
                inline: true,
            }
        );
    delete voicedico[interaction.member.id];
    file.set("voice", voicedico);
    file.save();
    interaction.reply({ embeds: [exampleEmbed] });
}

const definition = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Donne vos stats sur la monnaie, les niveaux");

module.exports = {
    trigger,
    definition,
};
