const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Action when the command is triggered
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 */
async function onTrigger(interaction) {
    // TODO: Make it working
    let file = editJsonFile("./fight.json");
    var membersdico = file.get("Saisons")["Wins"];

    var membersnbr = 0; // NUMBER OF MEMBERS
    for (var i in membersdico) {
        if (membersdico.hasOwnProperty(i)) membersnbr++;
    }

    var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
    for (var i in membersdico) {
        classementarray.push([membersdico[i], i]);
    }
    classementarray.sort(
        (function (index) {
            return function (a, b) {
                return a[index] === b[index] ? 0 : a[index] < b[index] ? 1 : -1;
            };
        })(0)
    );

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(
            ":crossed_swords:  **__Classement des gagnants de FIGHT DISCORD :__**"
        );

    if (membersnbr > 20) {
        membersnbr = 20;
    }
    var place_array = [
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
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
    ];

    for (let i = 1; i <= membersnbr; i++) {
        var user = classementarray[i - 1][1];
        var pseudo = "";

        if (user.includes("IA") == false) {
            let usered = await client.users.fetch(classementarray[i - 1][1]);
            pseudo = usered.username;
        } else {
            pseudo = classementarray[i - 1][1];
        }

        exampleEmbed.addFields({
            name: place_array[i - 1] + " **|** " + pseudo,
            value:
                " " + ":star:".repeat(membersdico[classementarray[i - 1][1]]),
            inline: true,
        });
    }

    interaction.reply({ embeds: [exampleEmbed] });
}

const definition = new SlashCommandBuilder()
    .setName("fightlead")
    .setDescription("Classement des vainqueurs de Fight Discord.");

module.exports = {
    onTrigger,
    definition,
};
