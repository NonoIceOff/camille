const { SlashCommandBuilder } = require("discord.js");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
function onTrigger(interaction) {
    return;
    var level = 0;
    var pourcentage = 0;
    let file = editJsonFile("./quests.json");
    var quests = file.get("Quests");
    var membersquests = file.get("Members");
    var quests_str = "Pas de quête disponible";
    var quests_completed = 0;
    if (!membersquests[interaction.user.id]) {
        membersquests[interaction.user.id] = {
            Level: 0,
            Quests: [0, 0, 0],
        };
    }

    for (let i = 0; i <= quests["Level " + level.toString()].length - 1; i++) {
        if (membersquests[interaction.user.id]["Quests"][i] === 1) {
            quests_completed += 1;
        }
    }
    if (quests_completed === quests["Level " + level.toString()].length) {
        membersquests[interaction.user.id]["Level"] += 1;
        membersquests[interaction.user.id]["Quests"] = [];
        for (
            let i = 0;
            i <= quests["Level " + level.toString()].length - 1;
            i++
        ) {
            membersquests[interaction.user.id]["Quests"].push(0);
        }
    }

    level = membersquests[interaction.user.id]["Level"];
    file.set("Members", membersquests);
    file.save();

    for (let i = 0; i <= quests["Level " + level.toString()].length - 1; i++) {
        if (membersquests[interaction.user.id]["Quests"][i] === 0) {
            if (quests_str === "Pas de quête disponible") {
                quests_str = "";
            }
            quests_str +=
                (i + 1).toString() +
                ". " +
                quests["Level " + level.toString()][i] +
                "\n";
        } else {
            pourcentage += 1;
        }
    }
    pourcentage = pourcentage / quests["Level " + level.toString()].length;
    pourcentage = pourcentage * 10;
    const embed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("Vos quêtes : ")
        .setDescription(
            "Niveau " +
                level.toString() +
                " : " +
                ":purple_square:".repeat(pourcentage) +
                ":black_large_square:".repeat(10 - pourcentage) +
                "+ **150 xp**"
        )
        .addFields(
            {
                name: "Quêtes disponibles : ",
                value: quests_str,
            },
            {
                name: "Quêtes hebdomadaires : ",
                value: "Pas de quête disponible",
            }
        );

    interaction.reply({
        embeds: [embed],
        fetchReply: true,
    });
}

const definition = new SlashCommandBuilder()
    .setName("quests")
    .setDescription("Commande de vos quêtes");

module.exports = {
    onTrigger,
    definition,
};
