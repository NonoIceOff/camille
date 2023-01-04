const test = 1

const { Discord,  REST, Routes, ActionRowBuilder, SelectMenuBuilder , ButtonBuilder, ButtonStyle, EmbedBuilder, Client, GatewayIntentBits, DiscordAPIError, Message, Guild, UserFlags, PermissionOverwrites, PermissionsBitField, Partials, Events, AttachmentBuilder, MessageAttachment} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const editJsonFile = require("edit-json-file");
var cron = require("cron");
var Canvas = null
if (test == 0) {
    Canvas = require("@napi-rs/canvas-linux-arm-gnueabihf");
} else {
    Canvas = require("@napi-rs/canvas");
}
const { request } = require('undici');


var guild_id = "909054839194013726"
if (test == 1) {
    guild_id = "918590223309496401"
}

const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const { joinVoiceChannel } = require('@discordjs/voice');


var rest = new REST({ version: '10' }).setToken("MTAwNTYxODc4MzUwMDY0NDM3Mg.GYna_5.nJG-9ZdGD_US2nGLYlsxcoDjbOquxcikUPfMPI");
if (test == 1) {
    rest = new REST({ version: '10' }).setToken("MTA1OTkyNDk3ODk5MDA3MTgzMA.GNPZlk.khryXj0TckbWCQFC1Z8iX_jy-t87dE7zdZl9Rw");
}

var adminrole = null
var dreamteam = null

const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");

const pingcmd = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Donne pong");

const lockcmd = new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locker un salon")
    .addBooleanOption(choice => choice.setName('status').setDescription('Activé ou désactivé'));

const statscmd = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Donne vos stats sur la monnaie, les niveaux");

const classementcmd = new SlashCommandBuilder()
    .setName("xplead")
    .setDescription("Classement des personnes en xp.")
    .addIntegerOption(result =>
        result.setName('page')
            .setDescription("Page")
            .setMinValue(1));

const economiecmd = new SlashCommandBuilder()
    .setName("coinslead")
    .setDescription("Classement des personnes les plus riches")
    .addIntegerOption(result =>
        result.setName('page')
            .setDescription("Page")
            .setMinValue(1));

const voiceleadcmd = new SlashCommandBuilder()
    .setName("voiceslead")
    .setDescription("Classement des personnes en vocal.")
    .addIntegerOption(result =>
        result.setName('page')
            .setDescription("Page")
            .setMinValue(1));

const jeucmd = new SlashCommandBuilder()
    .setName("launchgame")
    .setDescription("Lancer un jeu");

const pollcmd = new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Lancer un sondage")
    .addStringOption(titre =>
		titre.setName('titre')
			.setDescription('Le titre du sondage')
			.setRequired(true))
    .addStringOption(option1 =>
		option1.setName('option1')
			.setDescription('Réponse 1')
			.setRequired(true))
    .addStringOption(option2 =>
		option2.setName('option2')
			.setDescription('Réponse 2')
			.setRequired(true))
    .addStringOption(option3 =>
		option3.setName('option3')
			.setDescription('Réponse 3')
			.setRequired(false))
    .addStringOption(option4 =>
		option4.setName('option4')
			.setDescription('Réponse 4')
			.setRequired(false))
    .addStringOption(option5 =>
		option5.setName('option5')
			.setDescription('Réponse 5')
			.setRequired(false))
    .addStringOption(option6 =>
		option6.setName('option6')
			.setDescription('Réponse 6')
			.setRequired(false))
    .addStringOption(option7 =>
		option7.setName('option7')
			.setDescription('Réponse 7')
			.setRequired(false))
    .addStringOption(option8 =>
		option8.setName('option8')
			.setDescription('Réponse 8')
			.setRequired(false))
    .addStringOption(option9 =>
		option9.setName('option9')
			.setDescription('Réponse 9')
			.setRequired(false))
    .addStringOption(option10 =>
		option10.setName('option10')
			.setDescription('Réponse 10')
			.setRequired(false));

const rulescmd = new SlashCommandBuilder()
    .setName("rulescmd")
    .setDescription("rules");

const notifscmd = new SlashCommandBuilder()
    .setName("notifsmenu")
    .setDescription("Message de sélection de notifications");

const helpcmd = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Commande d'aide");

const hugcmd = new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Vous voulez un câlin ?")
    .addUserOption(msgid =>
        msgid.setName('membre')
            .setDescription("A qui voulez-vous faire un câlin ?")
            .setRequired(true))

const tiragecmd = new SlashCommandBuilder()
    .setName("tirage")
    .setDescription("Lancer un tirage au sort")
    .addStringOption(titre =>
		titre.setName('titre')
			.setDescription('Le titre du tirage au sort')
			.setRequired(true))

const bumpleadcmd = new SlashCommandBuilder()
    .setName("bumpslead")
    .setDescription("Classement des bumps.")
    .addIntegerOption(result =>
        result.setName('page')
            .setDescription("Page")
            .setMinValue(1));

const addxpcmd = new SlashCommandBuilder()
    .setName("addxp")
    .setDescription("Ajouter de l'xp a un membre du serveur")
    .addUserOption(msgid =>
        msgid.setName('membre')
            .setDescription("Membre à qui vous voulez give de l'xp")
            .setRequired(true))
    .addIntegerOption(result =>
		result.setName('montant')
			.setDescription("Montant de l'xp à donner")
            .setMinValue(1)
			.setRequired(true));

const removexpcmd = new SlashCommandBuilder()
    .setName("removexp")
    .setDescription("Retirer de l'xp a un membre du serveur")
    .addUserOption(msgid =>
        msgid.setName('membre')
            .setDescription("Membre à qui vous voulez retirer de l'xp")
            .setRequired(true))
    .addIntegerOption(result =>
        result.setName('montant')
            .setDescription("Montant de l'xp à retirer")
            .setMinValue(1)
            .setRequired(true));

const votecmd = new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Voter pour quelqu'un")
    .addUserOption(msgid =>
        msgid.setName('membre')
            .setDescription("Membre à qui vous lui donnez votre voie.")
            .setRequired(true))

const questscmd = new SlashCommandBuilder()
    .setName("quests")
    .setDescription("Commande de vos quêtes");

const shopcmd = new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Commande d'achats");

const fightcmd = new SlashCommandBuilder()
    .setName("fight")
    .setDescription("Fight discord");

const fightleadcmd = new SlashCommandBuilder()
    .setName("fightlead")
    .setDescription("Classement des vainqueurs de Fight Discord.");

const testcmd = new SlashCommandBuilder()
    .setName("test")
    .setDescription("test");

client.on("ready", async () => {
    adminrole = client.guilds.cache.get(guild_id).roles.cache.get("972596571915026512")
    dreamteam = client.guilds.cache.get(guild_id).roles.cache.get("995357904834134046")
    if (test == 1) {
        adminrole = client.guilds.cache.get(guild_id).roles.cache.get("1031268743516520589")
        dreamteam = client.guilds.cache.get(guild_id).roles.cache.get("1031268671470964766")
    }

    let votestart = new cron.CronJob('00 34 01 1 * *', startvote);
    votestart.start();
    let votestop = new cron.CronJob('00 00 00 2 * *', stopvote);
    votestop.start();
    let vidcheck = new cron.CronJob('00 00 20 * * *', newvid);
    vidcheck.start();
    let grades = new cron.CronJob('00 00 00 1 * *', givegrades);
    grades.start();

    console.log("bot connecté")
});

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return context.font;
};

async function givegrades() {

    const Role = client.guilds.cache.get(guild_id).roles.cache.get("1045465637138477148");
    Role.members.forEach((member, i) => { // Looping through the members of Role.
        member.roles.remove(Role); // Removing the Role.
    });

    const Role2 = client.guilds.cache.get(guild_id).roles.cache.get("1039297427431247873");
    Role2.members.forEach((member, i) => { // Looping through the members of Role.
        member.roles.remove(Role2); // Removing the Role.
    });

    const Role3 = client.guilds.cache.get(guild_id).roles.cache.get("995357904834134046");
    Role3.members.forEach((member, i) => { // Looping through the members of Role.
        member.roles.remove(Role3); // Removing the Role.
    });

    let file2 = editJsonFile("./shop.json")
    var shopdico = file2.get("Members")

    for (const [key, value] of Object.entries(shopdico)) {
        let member = await client.guilds.cache.get(guild_id).members.fetch(key)

        if (!shopdico[key]) {
            shopdico[key] = {"Grades": [0,0,0]}
            file2.set("Members",shopdico)
            file2.save()
        }

        for (let i = 0; i < 3; i++) {
            if (shopdico[key]["Grades"][i] >= 1) {
                if (i == 0) {
                    var role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "995357904834134046")
                    member.roles.add(role).catch(console.error);
                }
                if (i == 1) {
                    var role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "1039297427431247873")
                    member.roles.add(role).catch(console.error);
                }
                if (i == 2) {
                    var role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "1045465637138477148")
                    member.roles.add(role).catch(console.error);
                }
                shopdico[key]["Grades"][i] -= 1
                file2.set("Members",shopdico)
                file2.save()
            }
        }
    }

}

function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const _MS_PER_HOUR = 1000 * 60 * 60;
    const _MS_PER_MINUTE = 1000 * 60;
    // Discard the time and time-zone information.
    const utc1 = a
    const utc2 = b
    var days = Math.floor((utc2 - utc1) / _MS_PER_DAY)
    var hours = Math.floor((utc2 - utc1) / _MS_PER_HOUR)-(days*24)
    var minutes = Math.floor((utc2 - utc1) / _MS_PER_MINUTE)-days*60*24-hours*60
    return (days+"j "+hours+"h "+minutes+"m")
}

async function newvid() {
    const data = await parser.parseURL("https://youtube.com/feeds/videos.xml?channel_id=UCQQSTVhlzarMRlSuTfjuMzg").catch(console.error);
    const rawData = fs.readFileSync("./video.json");
    const jsonData = JSON.parse(rawData);

    if (jsonData.id !== data.items[0].id) {// new video or video not sent
        fs.writeFileSync("./video.json", JSON.stringify({id : data.items[0].id}))
        const {title, link, id, author} = data.items[0];
        var imagea = "https://i3.ytimg.com/vi/"
        imagea += id.slice(9)
        imagea += '/maxresdefault.jpg'
        const Embed = new EmbedBuilder({
            title: title,
            description: "Pour voir la vidéo, il vous suffit de cliquer sur le titre",
            url: link,
            color: 10181046,
            timestamp: Date.now(),
            image: {
                url: imagea, 
            },
            author: {
                name: author,
                iconURL : "https://yt3.ggpht.com/u48Ub7sOLV4jFWqtqsyqYU3387_mUIh17bweURjY0HtwaPkV96xVdyLcHCZe-fuf2wCzhFyh=s88-c-k-c0x00ffffff-no-rj-mo",
                url: "https://www.youtube.com/channel/UCQQSTVhlzarMRlSuTfjuMzg/?sub_confirmation=1"
            }
        })
        //await client.guilds.cache.get(guild_id).channels.cache.get("1032739537950101607").send({content: "<@&1006559817164406875> **Nouvelle vidéo !**" ,embeds: [Embed]})

        if (data.items[0]["title"].includes("#shorts") == true) {
            await client.guilds.cache.get(guild_id).channels.cache.get("1050825246657220608").send({content: "<@&946429189630881872> **Nouveau short !**" ,embeds: [Embed]})
        } else {
            await client.guilds.cache.get(guild_id).channels.cache.get("939249174849933404").send({content: "<@&940294478038696006> **Nouvelle vidéo !**" ,embeds: [Embed]})
        }
        
    };
}

async function startvote() {
    let file = editJsonFile("./infos.json")
    var votesdico = file.get("votes")
    votesdico["voted"] = {"start":1}
    if (votesdico["winner"]) {
        role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "1045465637138477148")
        client.guilds.cache.get(guild_id).members.fetch(votesdico["winner"]).then(member => {
            member.roles.remove(role);
        }).catch(console.log);
        delete votesdico["winner"]
    }
    file.set("votes", votesdico)
    file.save()

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":envelope:  __**Les votes du mois sont ouverts**__")
        .setDescription("Les votes du mois sont ouverts, vous avez maintenant 24h pour élire le meilleur membre du serveur.\nL'élu recevra le rôle <@1045446827887042700>")
    client.guilds.cache.get(guild_id).channels.cache.get("911659053216825414").send({embeds: [exampleEmbed] })

    file.set("votes", votesdico)
    file.save()
}

async function stopvote() {
    let file = editJsonFile("./infos.json")
    var votesdiso = file.get("votes")
    var winner_user = null
    delete votesdiso["voted"]

    var membersnbr = 0; // NUMBER OF MEMBERS
    for (var i in votesdiso) {
    if (votesdiso.hasOwnProperty(i)) membersnbr++;
    }

    var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
    for (var i in votesdiso) {
        classementarray.push([votesdiso[i],i])
    }
    classementarray.sort((function(index) {
        return function(a, b) {
            return (a[index] === b[index] ? 0 : (a[index] < b[index] ? 1 :-1));
        };
    })(0));

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":envelope:  __**Fermeture des votes, voici les résultats :**__")
    for (let i = 1; i <= membersnbr; i++) {
        user = await client.users.fetch(classementarray[i-1][1])
        let membered = user

        var personne = membered
        if (membered === undefined) {
            personne = "membre non connu"
        } else {
            personne = membered.username
        }
        if (i==1) {
            exampleEmbed.addFields({ name: ":trophy:  **|** "+personne, value: (classementarray[i-1][0]).toString()+" votes", inline: true })
            winner_user = await client.users.fetch(classementarray[i-1][1])
        }
        if (i>1) {
            exampleEmbed.addFields({ name: i.toString()+"e **|** "+personne, value: (classementarray[i-1][0]).toString()+" votes", inline: true })
        }
    }
    client.guilds.cache.get(guild_id).channels.cache.get("911659053216825414").send({embeds: [exampleEmbed] })

    votesdiso = {}
    votesdiso["voted"] = {"start":0}
    votesdiso["winner"] = winner_user.id
    file.set("votes", votesdiso)
    file.save()

    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "1045465637138477148")
    const member = client.guilds.cache.get(guild_id).members.cache.get(winner_user.id)
    member.roles.add(role).catch(console.error);
    member.send("Vous avez gagné le vote du mois, profitez de votre rôle **SUPER DREAM TEAM** ce mois-ci.")




}

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => { // Listeing to the voiceStateUpdate event
    let file = editJsonFile("./infos.json");
    var voicemember = file.get("voice");
    var number_voices = 0

    if (newVoiceState.member.voice.channel != null) {
        number_voices = newVoiceState.member.voice.channel.members.size
    }

    if (newVoiceState.member.voice.selfMute == false && number_voices > 1) { // SI PAS MUTE
        if (newVoiceState.channel) { // The member connected to a channel.
            if (!voicemember[newVoiceState.member.user.id]) { // Si conexxion simple
                start_voicetime_to_user(newVoiceState.member.user)
            } else { // Si changement de salon simple
                stop_voicetime_to_user(newVoiceState.member.user)
                start_voicetime_to_user(newVoiceState.member.user)
            }
        } else if (oldVoiceState.channel) { // The member disconnected from a channel.
            if (voicemember[newVoiceState.member.user.id]) {
                stop_voicetime_to_user(newVoiceState.member.user)
            }
        }
    } else { // SI MUTE
        stop_voicetime_to_user(newVoiceState.member.user)
    }
});

function start_voicetime_to_user(user) {
    let file = editJsonFile("./infos.json")
    var voicemember = file.get("voice")
    var olddate = new Date()
    var timestampInS = Math.floor(olddate.getTime()/1000)
    voicemember[user.id] = timestampInS
    file.set("voice",voicemember)
    file.save()
}

function stop_voicetime_to_user(user) {
    let file = editJsonFile("./infos.json")
    var voicemember = file.get("voice")
    var newdate = new Date() // Ajouter le temps
    var timestampInS = Math.floor(newdate.getTime()/1000)
    if (!voicemember["members_leaderboard"][user.id]) {
        voicemember["members_leaderboard"][user.id] = 0
    }
    if (voicemember["members_leaderboard"][user.id] == null) {
        voicemember["members_leaderboard"][user.id] = 0
    }
    file.set("voice",voicemember)
    file.save()
    if (voicemember[user.id]) {
        var diff = timestampInS - voicemember[user.id]
        voicemember["members_leaderboard"][user.id] += diff
        delete voicemember[user.id]
        file.set("voice",voicemember)
        file.save()
        var diff_min = Math.floor(diff/60)
        add_xp_to_user(user,5*diff_min)
    }
}

function add_xp_to_user(user,xp) {
    let file = editJsonFile("./infos.json")
    var membersdico = file.get("members")
    if(!membersdico[user.id]) {
        membersdico[user.id] = {"xp_total":0,"xp":0,"niveau":0,"esheep":0,"bumpstotal":0}
    }
    membersdico[user.id]["xp"] = membersdico[user.id]["xp"]+xp
    membersdico[user.id]["esheep"] += 0.1*xp
    membersdico[user.id]["xp_total"] = membersdico[user.id]["xp_total"]+xp
    while (membersdico[user.id]["xp"] >= 5*(Math.pow(membersdico[user.id]["niveau"], 2))+(50*membersdico[user.id]["niveau"])+100) {
        membersdico[user.id]["xp"] = membersdico[user.id]["xp"] - (5*(Math.pow(membersdico[user.id]["niveau"], 2))+(50*membersdico[user.id]["niveau"])+100)
        membersdico[user.id]["niveau"] += 1
        if (membersdico[user.id]["xp"] < 5*(Math.pow(membersdico[user.id]["niveau"], 2))+(50*membersdico[user.id]["niveau"])+100) {
            client.guilds.cache.get(guild_id).channels.cache.get("911659053216825414").send("<@"+user.id+"> tu es passé au **NIVEAU "+membersdico[user.id]["niveau"].toString()+"**")
        }
    }
    file.set("members",membersdico)
    file.save()
}

client.on("guildMemberAdd", member => {
    var messagesdico = ["J'espère que tu as bien posé tes valises","Tu es au bon endroit !","Attention à Rémi, il est dangereux mdr","UN MAX D'APPLAUDISSEMENTS :clap:","Quel bonbon est toujours blasé ? Le choco-las","On m'a demandé d'écrire un message de bienvenue, sauf que j'ai la flemme.","Tu est tombé au bon endroit.","Si Foxus ne te dit pas bienvenue dans les 5 minutes, il aura le seum.","Oui, ceci est bien un message de bienvenue","Aladin débarque pour vous donner du bifle!","Connaissez-vous Twitch Prime ?","C'est bien une des premières étapes pour battre carakle (triple champion du monde de Fight).","Y'a aucun soucis si personne ne te dit bienvenue dès maintenant, c'est soit ils dorment soit ils dorment.","Solo, tête sous l'eau, j'me suis dit, C'est l'moment mets l'fire ! Fire","Tu viens d'emprunter le téléporteur mystère et es tombé dans le serveur"]
    var messagesdicoindex = Math.floor(Math.random() * messagesdico.length);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('coucou')
                .setLabel('👋 Fais coucou !')
                .setStyle(ButtonStyle.Danger),
        );
    client.guilds.cache.get(guild_id).channels.cache.get("909054839646986252").send({content :"**<@"+member.id+"> bienvenue !** "+messagesdico[messagesdicoindex], components: [row]});
    member.roles.add("909079308121813012");
});

client.on("messageCreate", async message => {

    //Si dans un jeu
    if (message.guild === null) {
        let file = editJsonFile("./infos.json");
        let fileg = editJsonFile("./infos.json");
        var gamesdico = fileg.get("games");
        var membersdico = file.get("members");
        if(message.author.id != "1005618783500644372"){
            if(!gamesdico[message.author.id]) {
                gamesdico[message.author.id] = {"game_name":"null"}
            }
            fileg.set("games",gamesdico)
            fileg.save()
            if(!membersdico[message.author.id]) {
                membersdico[message.author.id] = {"xp_total":0,"xp":0,"niveau":0,"esheep":0,"bumpstotal":0}
            }
            file.set("members",membersdico)
            file.save()
            // JUSTE PRIX
            if (gamesdico[message.author.id]["game_name"] == "juste_prix") {
                game_jp(message.author)
            }
            // PUISSANCE 4
            if (gamesdico[message.author.id]["game_name"] == "puissance_4") {
                game_p4(message.author)
            }
        }
    }

    if (message.type === 20 && message.interaction.commandName == "bump") {
        var inter = message.interaction.user.id
        var interuser = message.interaction.user
        message.channel.lastMessage.delete()
        let file2 = editJsonFile("./infos.json");
        var bumpmember = file2.get("bump");
        var membersdico = file2.get("members");
        if(!membersdico[inter]) {
            membersdico[inter] = {"xp_total":0,"xp":0,"niveau":0,"esheep":0,"bumpstotal":0}
        }
        bumpmember[inter] = bumpmember[inter] + 1
        membersdico[inter]["bumpstotal"] = membersdico[inter]["bumpstotal"] + 1
        file2.set("bump",bumpmember)
        file2.set("members",membersdico)
        file2.save()
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":flashlight:   __**Bump effectué !**__")
            .setDescription('***Merci <@'+inter+"> pour le bump***, il a bien été comptabilisé au classement des bumps *(/bumplead)*. Vous contribuez au développement du serveur !\nVous avez gagné **150 xp** !")
        message.channel.send({ embeds: [exampleEmbed] })
        add_xp_to_user(interuser,150)
    }

    if(message.author.id != "1005618783500644372"){
        if(message.author.id != "1059924978990071830"){
            if (message.channelId != "911659053216825414") {
            //if(message.guildId == guild_id) {
                let file3 = editJsonFile("./infos.json")
                var membersdico = file3.get("members")
                if (!membersdico[message.author.id]) {
                    membersdico[message.author.id] = {"xp_total":0,"xp":0,"niveau":0,"esheep":0,"bumpstotal":0}
                }
                file3.set("members",membersdico)
                file3.save()
                var gain_xp = 5+Math.floor(Math.random() * 5)+1
                add_xp_to_user(message.author,gain_xp)
            }
       }
    }
});

async function start_fight_qualifs() {
    const timer = ms => new Promise(res => setTimeout(res, ms))

    let file = editJsonFile("./fight.json")
    var fightdico = file.get("Saisons")

    var max = fightdico[fightdico["Number"].toString()]["Joueurs"]
    var qualified = 0
    if (max === 4) {
        qualified = 2
    } else if (max === 8) {
        qualified = 4
    } else if (max === 16) {
        qualified = 8
    } else if (max === 32) {
        qualified = 16
    }

    fightdico[fightdico["Number"].toString()]["Qualifs"] = {}

    for (var i = 0; i < max; i++) {
        var key = fightdico[fightdico["Number"].toString()]["Inscriptions"][i]

        fightdico[fightdico["Number"].toString()]["Qualifs"][key] = {"Points":0,"Morts":0,"Kills":0}
        fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Kills"] = Math.floor(Math.random() * (200 - 50) + 50)
        var multiplier_deaths = Math.random() * (75 - 30) + 30
        fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Morts"] = Math.floor(fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Kills"]/multiplier_deaths)
        var multiplier = Math.random() * (2.5 - 1) + 1
        fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Points"] = Math.floor(fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Kills"] * multiplier)

        file.set("Saisons",fightdico)
        file.save()

        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle("**Fight Discord | Manche qualificative**")
            .addFields(
                { name: 'Kills de mobs : ', value: fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Kills"].toString(), inline: true },
                { name: 'Points gagnés : ', value: fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Points"].toString(), inline: true },
                { name: 'Morts : ', value: fightdico[fightdico["Number"].toString()]["Qualifs"][key]["Morts"].toString(), inline: true }
            )
            .setFooter({ text: 'Episode '+(i+1).toString()+" / "+max.toString()});

        if (key.includes("IA") == false) {
            user = await client.users.fetch(key)
            exampleEmbed.setDescription("**"+user.username+"**")
        } else {
            exampleEmbed.setDescription("**"+key+"**")
        }

        await timer(60000/60*600) // then the created Promise can be awaited
        client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({embeds: [exampleEmbed]})
    }

    await timer(60000/60) // Pause de 10 sec
    var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
    var resultdico = fightdico[fightdico["Number"].toString()]["Qualifs"]
    for (var i in resultdico) {
        classementarray.push([resultdico[i]["Points"],i])
    }
    classementarray.sort((function(index) {
        return function(a, b) {
            return (a[index] === b[index] ? 0 : (a[index] < b[index] ? 1 :-1));
        };
    })(0));

    var exampleEmbed = new EmbedBuilder()
        .setColor(12154643)
        .setTitle("**Fight Discord | Manche qualificative | Résultats**")

    fightdico[fightdico["Number"].toString()]["Finals"] = {}

    for (let i = 1; i <= max; i++) {
        var user = classementarray[i-1][1]
        var pseudo = ""
        var match = 0

        if (user.includes("IA") == false) {
            let usered = await client.users.fetch(classementarray[i-1][1])
            pseudo = usered.username
        } else {
            pseudo = classementarray[i-1][1]
        }

        var points = classementarray[i-1][0]
        if (i == 20) {
            client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({embeds: [exampleEmbed]})
            var exampleEmbed = new EmbedBuilder()
                .setColor(12154643)
                .setTitle("**Fight Discord | Manche qualificative | Résultats 2**")
        }
        if (i<=qualified) {
            match = (i/2)
            exampleEmbed.addFields({ name: "🇶 "+pseudo, value: points.toString()+" points", inline: true })
            fightdico[fightdico["Number"].toString()]["Finals"][classementarray[i-1][1]] = {"Phase":1,"Points":0,"Kills":0,"Morts":0,"Match":match}
        }
        else {
            exampleEmbed.addFields({ name: pseudo, value: points.toString()+" points", inline: true })
        } 
    }

    file.set("Saisons",fightdico)
    file.save()

    client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({embeds: [exampleEmbed]})

    await timer(60000/60)
    start_fight_finals()


}

async function start_fight_finals() { 
    const timer = ms => new Promise(res => setTimeout(res, ms))
    let file = editJsonFile("./fight.json")
    var fightdico = file.get("Saisons")

    fightdico[fightdico["Number"].toString()]["Inscriptions"] = []
    file.set("Saisons",fightdico)
    file.save()

    
    var max = Object.keys(fightdico[fightdico["Number"].toString()]["Finals"]).length
    var win = ""
    while (max >= 2) {
        var newinscrs = []
        var exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle("**Fight Discord | Phase éliminatoire**")

        var intitule = "Match"
        if (max == 4) {
            intitule = "Demi-Finale"
        } else if (max == 8) {
            intitule = "Quart de Finale"
        } else if (max == 16) {
            intitule = "Huitième de Finale"
        } else if (max == 2) {
            intitule = "Finale"
        } 

        var min = 0 // AFFICHER LES MATCHS
        var text = ""
        for (const [key, value] of Object.entries(fightdico[fightdico["Number"].toString()]["Finals"])) {
            fightdico[fightdico["Number"].toString()]["Inscriptions"].push(key)
            if (min % 2 == 1) {
                text += " vs "+key
                exampleEmbed.addFields({ name: intitule+" "+(Math.floor(min/2)+1).toString(), value: text, inline: true })
                text = ""
            } else {
                text += key
            }
            min += 1
        }
        client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({embeds: [exampleEmbed]})

        await timer(60000/60*600)

        var match_j1 = ["id",0]
        var match_j2 = ["id",0]
        var pseudos = ["",""]
        var newfinal = {}
        for (var i = 0; i < max; i++) { // LES MATCHS
            var key = fightdico[fightdico["Number"].toString()]["Inscriptions"][i]
    
            fightdico[fightdico["Number"].toString()]["Finals"][key]["Kills"] = Math.floor(Math.random() * (200 - 50) + 50)
            var multiplier_deaths = Math.random() * (75 - 30) + 30
            fightdico[fightdico["Number"].toString()]["Finals"][key]["Morts"] = Math.floor(fightdico[fightdico["Number"].toString()]["Finals"][key]["Kills"]/multiplier_deaths)
            var multiplier = Math.random() * (2.5 - 1) + 1
            fightdico[fightdico["Number"].toString()]["Finals"][key]["Points"] = Math.floor(fightdico[fightdico["Number"].toString()]["Finals"][key]["Kills"] * multiplier)
            
            const exampleEmbed = new EmbedBuilder()
                .setColor(12154643)
                .setTitle("**Fight Discord | "+intitule+" "+(Math.floor(i/2)+1).toString()+"| Résultats**")

            var pseuded = ""
            if (key.includes("IA") == false) {
                user = await client.users.fetch(key)
                pseuded = user.username
            } else {
                pseuded = key
            }
            pseudos[i] = pseuded

            if (i % 2 == 0) {
                pseudos[0] = pseuded
                match_j1[0] = key
                match_j1[1] = fightdico[fightdico["Number"].toString()]["Finals"][key]["Points"]
                match_j2 = ["id",0]
                pseudos[1] = ""
            } else if (i % 2 == 1) {
                pseudos[1] = pseuded
                match_j2[0] = key
                match_j2[1] = fightdico[fightdico["Number"].toString()]["Finals"][key]["Points"]

                if (match_j1[1] >= match_j2[1]) {
                    win = match_j1[0]
                    newinscrs.push(match_j1[0])
                    newfinal[match_j1[0]] = {"Phase":1,"Points":0,"Kills":0,"Morts":0,"Match":i/2}
                    exampleEmbed.addFields({ name: "🇶 "+pseudos[0], value: match_j1[1].toString()+" points", inline: true })
                    exampleEmbed.addFields({ name: pseudos[1], value: match_j2[1].toString()+" points", inline: true })
                } else {
                    newinscrs.push(match_j2[0])
                    newfinal[match_j2[0]] = {"Phase":1,"Points":0,"Kills":0,"Morts":0,"Match":i/2}
                    exampleEmbed.addFields({ name: "🇶 "+pseudos[1], value: match_j2[1].toString()+" points", inline: true })
                    exampleEmbed.addFields({ name: pseudos[0], value: match_j1[1].toString()+" points", inline: true })
                }

                client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({embeds: [exampleEmbed]})
                match_j1 = ["id",0]
                pseudos[0] = ""
                await timer(60000/60*600)

            }

            file.set("Saisons",fightdico)
            file.save()
        }

        fightdico[fightdico["Number"].toString()]["Finals"] = newfinal
        fightdico[fightdico["Number"].toString()]["Inscriptions"] = newinscrs
        file.set("Saisons",fightdico)
        file.save()

        await timer(60000/60)

        max = max/2
    }
    client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send(":tada: **"+win+" a gagné**")
    fightdico["Number"] = fightdico["Number"] + 1

    if (!fightdico["Wins"][win]) {
        fightdico["Wins"][win] = 1
    } else {
        fightdico["Wins"][win] = fightdico["Wins"][win] + 1
    }

    file.set("Saisons",fightdico)
    file.save()
}

client.on("interactionCreate", async interaction => {
    if(interaction.isChatInputCommand()){

        if(interaction.commandName === "test"){
            // Create a 700x250 pixel canvas and get its context
            // The context will be used to modify the canvas
            const canvas = Canvas.createCanvas(700, 250);
            const context = canvas.getContext('2d');

            const background = await Canvas.loadImage('./back.png');

            // This uses the canvas dimensions to stretch the image onto the entire canvas
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Set the color of the stroke
            context.strokeStyle = '#ae00ff';

            // Draw a rectangle with the dimensions of the entire canvas
            context.strokeRect(0, 0, canvas.width, canvas.height);

            // Slightly smaller text placed above the member's display name
            context.font = '28px sans-serif';
            context.fillStyle = '#ffffff';
            context.fillText("Profil de "+interaction.member.displayName, canvas.width / 2.5, canvas.height / 3.5);

            // Pick up the pen
            context.beginPath();

            // Start the arc to form a circle
            context.arc(125, 125, 100, 0, Math.PI * 2, true);

            // Put the pen down
            context.closePath();

            // Clip off the region you drew on
            context.clip();

            // Using undici to make HTTP requests for better performance
            const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }));
            const avatar = await Canvas.loadImage(await body.arrayBuffer());

            // Move the image downwards vertically and constrain its height to 200, so that it's square
	        context.drawImage(avatar, 25, 25, 200, 200);

            // Use the helpful Attachment class structure to process the file for you
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

            interaction.reply({ files: [attachment] });
        }

        if(interaction.commandName === "help"){
            var text = ""
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                text = text+"**:badminton: __Admins commands__ :** \n"
                text = text+"**/lock** : *verrouiller ou dévérouiller un salon* \n"
                text = text+"**/rulescmd** : *afficher les règles* \n"
                text = text+"**/fight** : *panneau de contrôle pour FIGHT DISCORD* \n"
                text = text+"**/tirage** : *lancer un tirage au sort* \n"
            }
            if (interaction.member.roles.cache.has(dreamteam.id) === true) {
                text = text+"\n**:watermelon: __Dream Team commands__ :** \n"
                text = text+"**/poll** : *lancer un sondage* \n"
            }
            text = text+"\n**__Commands__ :** \n"
            text = text+"**/shop** : *voir le shop* \n"
            text = text+"**/launchgame** : *jouer à un jeu et mettre en jeu de l'xp* \n"
            text = text+"**/ping** : *affiche le ping* \n"
            text = text+"**/xplead** : *classement de l'xp du serveur* \n"
            text = text+"**/stats** : *affiche vos statistiques* \n"
            text = text+"**/coinslead** : *classement des coins du serveur* \n"
            text = text+"**/voiceslead** : *classement du temps de vocal du serveur* \n"
            text = text+"**/bumpslead** : *classement des bumps mensuels du serveur* \n"
            text = text+"**/fightlead** : *classement des gagnants de FIGHT DISCORD du serveur* \n"
            text = text+"**/hug** : *faire un câlin à quelqu'un* \n"
            text = text+"**/quests** : *voir ses quêtes* \n"
            text = text+"**/givecoins** : *donner des coins à quelqu'un* \n"

            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle('Commandes disponibles pour vous')
                .setDescription(text)
           
            interaction.reply({ embeds: [exampleEmbed], fetchReply: true  });
        }

        if(interaction.commandName === "ping"){
            interaction.reply("pong");
        }

        if(interaction.commandName === "lock"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                let role = interaction.guild.roles.cache.find(r => r.name === "@everyone");
                if (interaction.options.getBoolean("status") == true)
                {
                    interaction.channel.permissionOverwrites
                        .edit(role.id, { SendMessages: false});
                        //interaction.reply("**Salon vérouillé**");
                        interaction.channel.send("**Salon vérouillé**");
                } else {
                    interaction.channel.permissionOverwrites
                        .edit(role.id, { SendMessages: true})
                        //interaction.reply("**Salon dévérouilllé**");
                        interaction.channel.send("**Salon dévérouillé**");
                }
                interaction.reply("En attente...")
                await interaction.deleteReply();
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "poll"){
            if (interaction.member.roles.cache.has(dreamteam.id) === true) {
                var descr = "<:poll1:1017112408248041543> "+interaction.options.getString('option1')
                descr += "\n<:poll2:1017113079869341818> "+interaction.options.getString('option2')
                
                if (interaction.options.getString("option3") != null) {
                    descr += "\n<:poll3:1017113080989221016> "+interaction.options.getString('option3')
                }
                if (interaction.options.getString("option4") != null) {
                    descr += "\n<:poll4:1017113694854979674> "+interaction.options.getString('option4')
                }
                if (interaction.options.getString("option5") != null) {
                    descr += "\n<:poll5:1017113696130060348> "+interaction.options.getString('option5')
                }
                if (interaction.options.getString("option6") != null) {
                    descr += "\n<:poll6:1017113697166041108> "+interaction.options.getString('option6')
                }
                if (interaction.options.getString("option7") != null) {
                    descr += "\n<:poll7:1017114267356504114> "+interaction.options.getString('option7')
                }
                if (interaction.options.getString("option8") != null) {
                    descr += "\n<:poll8:1017114268564463626> "+interaction.options.getString('option8')
                }
                if (interaction.options.getString("option9") != null) {
                    descr += "\n<:poll9:1017114270120562728> "+interaction.options.getString('option9')
                }
                if (interaction.options.getString("option10") != null) {
                    descr += "\n<:poll10:1017114271437553815> "+interaction.options.getString('option10')
                }
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(':bar_chart: **__'+interaction.options.getString('titre')+'__**')
                    .setDescription(descr)
                const message = await interaction.reply({ embeds: [exampleEmbed], fetchReply: true  })
                message.react("<:poll1:1017112408248041543>")
                message.react("<:poll2:1017113079869341818>")
                if (interaction.options.getString("option3") != null) {
                    message.react("<:poll3:1017113080989221016>")
                }
                if (interaction.options.getString("option4") != null) {
                    message.react("<:poll4:1017113694854979674>")
                }
                if (interaction.options.getString("option5") != null) {
                    message.react("<:poll5:1017113696130060348>")
                }
                if (interaction.options.getString("option6") != null) {
                    message.react("<:poll6:1017113697166041108>")
                }
                if (interaction.options.getString("option7") != null) {
                    message.react("<:poll7:1017114267356504114>")
                }
                if (interaction.options.getString("option8") != null) {
                    message.react("<:poll8:1017114268564463626>")
                }
                if (interaction.options.getString("option9") != null) {
                    message.react("<:poll9:1017114270120562728>")
                }
                if (interaction.options.getString("option10") != null) {
                    message.react("<:poll10:1017114271437553815>")
                }
                message.channel.send("<:pollup:1017130270979264602> <:pollup:1017130270979264602> <@&940294485940781177>")
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+dreamteam.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "notifsmenu"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(':bell: **__Sélection des notifications__**')
                    .setDescription("📊 **Sondages**    *(Ne pas louper les sondages du serveur)*\n🔴 **Vidéos**    *(Ne pas louper les vidéos)*\n🏆 **Evènements**    *(Ne pas louper les évents organisés sur le serveur)*\n🍺 **Shorts**    *(Ne pas louper les vidéos courtes)*")
                const message = await interaction.reply({ embeds: [exampleEmbed], fetchReply: true  })

                message.react("📊")
                message.react("🔴")
                message.react("🏆")
                message.react("🍺")
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "rulescmd"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(':books: __**Règles**__ de Shinsetsu Kurabu *V3*')
                    .setDescription("**__Introduction__**\nBienvenue dans le serveur Shinsetsu Kurabu. Avant de bien vous installer, veuillez lire les règles pour éviter de vous confronter avec des surprises. Toute mise à jour des règles sera annoncée.")
                    .addFields(
                        { name: '**__Chapitre I :__ le textuel**', value: "1. Toutes sortes d'insultes, de diffamations, de discriminations, de racismes sur tous les salons textuels seront bloquées par l'automod ou supprimées par la modération et est sanctionnable\n2. Tout manque de respect, insultes, publicités en message privé peut être bannissable (si vous en recevez, n'hésitez surtout pas à contacter la modération qui s'occupera de la situation)\n3. Les personnes participantes à un raid spamm seront bannis.\n4. Le spamming est non toléré.\n5. Le non-respect abusif des thèmes de salons, peut entraver une sanction" },
                        { name: '**__Chapitre II :__ le vocal**', value: "1. Les insultes, les diffamations, les discriminations de tout genre, les racismes, entraîneront définitivement un bannissement\n2. Les soundboards sont autorisés, seulement s'ils sont soutenables et respectueux des oreilles de tout le monde" },
                        { name: '**__Chapitre III :__ les autres règles**', value: "1. L'administration se réserve le droit de révises ces règles afin de les modifier ou d'en rajouter dans le futur, c'est-à-dire : faites attention\n2. Toute forme de publicité est interdite, on vous a prévenu\n3. Commencez pas à être casse-couilles (démerdez-vous avec cette info)\n4. Si vous trouvez par chance une Fanny Shiny, veuillez immédiatement contacter les forces de l'ordre."},
                    )

                interaction.reply({ embeds: [exampleEmbed], fetchReply: true  })
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "bumpslead"){
            await interaction.reply('Je travaille dessus ...');
            if (interaction.options.getInteger('page') == null) {
                leads(1,interaction,"bumps_lead")
            } else {
                leads(interaction.options.getInteger('page'),interaction,"bumps_lead")
            }
        }

        if(interaction.commandName === "xplead"){
            await interaction.reply('Je travaille dessus ...');
            if (interaction.options.getInteger('page') == null) {
                leads(1,interaction,"xp_lead")
            } else {
                leads(interaction.options.getInteger('page'),interaction,"xp_lead")
            }
        }

        if(interaction.commandName === "voiceslead"){
            await interaction.reply('Je travaille dessus ...');
            if (interaction.options.getInteger('page') == null) {
                leads(1,interaction,"voices_lead")
                //voice_lead(1,interaction)
            } else {
                leads(interaction.options.getInteger('page'),interaction,"voices_lead")
                //voice_lead(interaction.options.getInteger('page'),interaction)
            }
        }

        if(interaction.commandName === "stats"){
            let file = editJsonFile("./infos.json");
            var membersdico = file.get("members");
            var bumpdico = file.get("bump");
            var voicedico = file.get("voice");
            var max_xp_to_level = -1
            var result = "Non enregistré"
            var niveau = "Non enregistré"
            var xp = "Non enregistré"
            var monnaie = "Non enregistré"
            var nbrbump = "Non enregistré"
            var nbrbumpm = "Non enregistré"
            if (!membersdico[interaction.member.id]) {
                membersdico[interaction.member.id] = {"xp_total":0,"xp":0,"niveau":0,"esheep":0,"bumpstotal":0}
            }
            if (!voicedico[interaction.member.id]) {
                voicedico[interaction.member.id] = 0
            }
            if (membersdico[interaction.member.id]) {
                niveau = membersdico[interaction.member.id]["niveau"]
                xp = membersdico[interaction.member.id]["xp"]
                monnaie = Math.round(membersdico[interaction.member.id]["esheep"]*1000)/1000
                max_xp_to_level = 5*(Math.pow(membersdico[interaction.member.id]["niveau"], 2))+(50*membersdico[interaction.member.id]["niveau"])+100
                nbrbump = membersdico[interaction.member.id]["bumpstotal"]
            }
            if (bumpdico[interaction.member.id]) {
                nbrbumpm = bumpdico[interaction.member.id]
            }
            if (voicedico["members_leaderboard"][interaction.member.id]) {
                var date = new Date(null);
                date.setSeconds(voicedico["members_leaderboard"][interaction.member.id]); // specify value for SECONDS here
                result = date.toISOString().substr(11, 8);
            }
            file.set("members",membersdico)
            file.set("voice",voicedico)
            file.save()

            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle(':desktop:  __**Statistiques de '+interaction.member.displayName+"**__")
                .setDescription("Toutes vos statisques, au même endroit, c'est ICI.")
                .addFields(
                    { name: 'Niveau :', value: "**"+niveau+"** ("+xp+"/"+max_xp_to_level+")", inline: true },
                    { name: 'Monnaie :', value: "**"+monnaie+'** :coin:', inline: true },
                    { name: 'Temps en vocal :', value: "**"+result.toString()+"**", inline: true },
                    { name: 'Bumps (all time) :', value: "**"+nbrbump.toString()+"**", inline: true },
                    { name: 'Bumps (ce mois-ci) :', value: "**"+nbrbumpm.toString()+"**", inline: true }
                )
            delete voicedico[interaction.member.id]
            file.set("voice",voicedico)
            file.save()
            interaction.reply({ embeds: [exampleEmbed] });
        }

        if(interaction.commandName === "coinslead"){
            await interaction.reply('Je travaille dessus ...');
            if (interaction.options.getInteger('page') == null) {
                leads(1,interaction,"coins_lead")
                //coins_lead(1,interaction)
            } else {
                leads(interaction.options.getInteger('page'),interaction,"coins_lead")
                //coins_lead(interaction.options.getInteger('page'),interaction)
            }
        }

        if(interaction.commandName === "launchgame"){
            const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('jeu_selection')
					.setPlaceholder('Aucun jeu sélectionné')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions([
                        {
							label: 'Juste Prix',
							description: '5 essais pour trouver un nombre entre 1 et 100',
							value: 'jp',
						},
						{
							label: 'Pierre feuille ciseau',
							description: 'En Best-Of 3. Celui qui a le meilleur score gagne.',
							value: 'pfc',
						}
						//{
						//	label: 'Puissance 4',
						//	description: 'Une grille, comme le puissance 4',
						//	value: 'p4',
						//},
					]),
			);

		    await interaction.reply({ content: 'Selectionnez votre jeu :', components: [row] });

        }

        if(interaction.commandName === "hug"){
            var membre = interaction.options.getUser('membre')
            if (membre != interaction.user && membre.id != "1005618783500644372") {
                await interaction.reply("__**<@"+interaction.user+"> fait un câlin**__ à <@"+membre+"> *(c'est mewgnon)*");
            }
            else if (membre == interaction.user) {
                await interaction.reply("__**<@"+interaction.user+"> se fait un câlin**__ à... lui-même *(ok...)*");
            } else {
                await interaction.reply("__**<@"+interaction.user+"> me fait un câlin.**__ *(tout le monde me fait des câlins ? faut croire...)*");
            }
            interaction.channel.send("https://media.tenor.com/iwKHdW8wi1IAAAAC/tohka-yatogami.gif")
        }

        if(interaction.commandName === "addxp"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                var membre = interaction.options.getUser('membre')
                add_xp_to_user(membre,interaction.options.getInteger('montant'))
                interaction.reply("**"+membre.username+"** a été give de "+interaction.options.getInteger('montant')+"xp.")
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "removexp"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                let file = editJsonFile("./infos.json");
                var membersdico = file.get("members");
                var membre = interaction.options.getUser('membre')
                var montant = interaction.options.getInteger('montant')
                membersdico[membre.id]["xp"] = membersdico[membre.id]["xp"]-interaction.options.getInteger('montant')
                membersdico[membre.id]["xp_total"] = membersdico[membre.id]["xp_total"]-montant
                while (membersdico[membre.id]["xp"] < 0) {
                    membersdico[membre.id]["niveau"] -= 1
                    membersdico[membre.id]["xp"] = membersdico[membre.id]["xp"]+(5*(Math.pow(membersdico[membre.id]["niveau"], 2))+(50*membersdico[membre.id]["niveau"])+100)
                }

                file.set("members",membersdico)
                file.save()
                interaction.reply("**"+membre.username+"** a été retiré de "+interaction.options.getInteger('montant')+"xp.")
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "tirage"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                let file = editJsonFile("./infos.json");
                var tiragesdico = file.get("tirages");
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(':moneybag: Tentez de gagner... **__'+interaction.options.getString('titre')+'__**')
                    .setDescription("Tirage au sort dès que l'auteur réponde.")
                const message = await interaction.reply({ embeds: [exampleEmbed], fetchReply: true  })
                message.react("💰")
                tiragesdico[message.id] = {}
                tiragesdico[message.id]["author"] = interaction.user.id
                tiragesdico[message.id]["present"] = interaction.options.getString('titre').toString()
                file.set("tirages",tiragesdico);
                file.save()
            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "vote"){
            if (interaction.channel == client.channels.cache.get("911659053216825414")) {
                let file = editJsonFile("./infos.json");
                var membersdico = file.get("votes");
                var max_votes = 1
                if (interaction.member.roles.cache.has(dreamteam.id) === true) {
                    max_votes = 2
                }
                if (!membersdico[interaction.options.getUser('membre').id]) {
                    membersdico[interaction.options.getUser('membre').id] = 0
                }
                if (!membersdico["voted"][interaction.user.id]) {
                    membersdico["voted"][interaction.user.id] = 0
                }
                var desc = ""
                if (max_votes - membersdico["voted"][interaction.user.id]-1 > 0) {
                    desc = "\n*Il vous reste "+(max_votes - membersdico["voted"][interaction.user.id]-1)+" vote.*"
                } else {
                    desc = "\n:warning: *Il ne vous reste plus aucun vote.*"
                }
                if (membersdico["voted"]["start"] === 1) {
                    if (membersdico["voted"][interaction.user.id] < max_votes) {
                        membersdico[interaction.options.getUser('membre').id] += 1
                        membersdico["voted"][interaction.user.id] += 1
                        file.set("votes",membersdico)
                        file.save()

                        const exampleEmbed = new EmbedBuilder()
                        .setColor(10181046)
                        .setTitle(":ballot_box:  __**Vote comptabilisé !**__")
                        .setDescription('Merci <@'+interaction.user+"> pour ton vote, il a bien été comptabilisé."+desc)
                        //interaction.channel.permissionOverwrites
                        //    .edit(interaction.user.id, { SendMessages: false});
                        interaction.reply({ embeds: [exampleEmbed] })
                    } else {
                        const exampleEmbed = new EmbedBuilder()
                        .setColor(10038562)
                        .setTitle(":warning:  __**Vote non comptabilisé.**__")
                        .setDescription("Vous avez déja épuisé tous vos votes.")
                        //interaction.channel.permissionOverwrites
                        //    .edit(interaction.user.id, { SendMessages: false});
                        interaction.reply({ embeds: [exampleEmbed] })
                    }
                } else {
                    const exampleEmbed = new EmbedBuilder()
                    .setColor(10038562)
                    .setTitle(":warning:  __**Vote non comptabilisé.**__")
                    .setDescription("Les votes ne sont pas ouverts actuellement.")
                    //interaction.channel.permissionOverwrites
                    //    .edit(interaction.user.id, { SendMessages: false});
                    interaction.reply({ embeds: [exampleEmbed] })
                }
            } else {
                interaction.reply("Mauvais salon. Dommage.")
            }
        }

        if(interaction.commandName === "quests"){
            var level = 0
            var pourcentage = 0
            let file = editJsonFile("./quests.json");
            var quests = file.get("Quests");
            var membersquests = file.get("Members");
            var quests_str = "Pas de quête disponible"
            var quests_completed = 0
            if (!membersquests[interaction.user.id]) {
                membersquests[interaction.user.id] = {"Level":0,"Quests":[0,0,0]}
            }

            for (let i = 0; i <= quests["Level "+level.toString()].length-1; i++) {
                if (membersquests[interaction.user.id]["Quests"][i] === 1) {
                    quests_completed += 1
                }
            }
            if (quests_completed === quests["Level "+level.toString()].length) {
                membersquests[interaction.user.id]["Level"] += 1
                membersquests[interaction.user.id]["Quests"] = []
                for (let i = 0; i <= quests["Level "+level.toString()].length-1; i++) {
                    membersquests[interaction.user.id]["Quests"].push(0)
                }
            }

            level = membersquests[interaction.user.id]["Level"]
            file.set("Members", membersquests)
            file.save()
            
            for (let i = 0; i <= quests["Level "+level.toString()].length-1; i++) {
                if (membersquests[interaction.user.id]["Quests"][i] === 0) {
                    if (quests_str === "Pas de quête disponible") {
                        quests_str = ""
                    }
                    quests_str += (i+1).toString()+". "+quests["Level "+level.toString()][i]+"\n"
                } else {
                    pourcentage += 1
                }
            }
            pourcentage = pourcentage/quests["Level "+level.toString()].length
            pourcentage = pourcentage*10
            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle("Vos quêtes : ")
                .setDescription("Niveau "+level.toString()+" : "+":purple_square:".repeat(pourcentage)+":black_large_square:".repeat(10-pourcentage)+"+ **150 xp**")
                .addFields(
                    { name: "Quêtes disponibles : ", value: quests_str},
                    { name: "Quêtes hebdomadaires : ", value: "Pas de quête disponible"}
                )
            
            interaction.reply({ embeds: [exampleEmbed], fetchReply: true  })
        }

        if(interaction.commandName === "shop"){
            let file = editJsonFile("./infos.json")
            var membersdico = file.get("members")

            let file2 = editJsonFile("./shop.json")
            var shopdico = file2.get("Members")

            if (!shopdico[interaction.user.id]) {
                shopdico[interaction.user.id] = {"Grades": [0,0,0]}
                file2.set("Members",shopdico)
                file2.save()
            }

            var coins = membersdico[interaction.user.id]["esheep"]
            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle(":barber: __Shop :__ ")
                .setDescription("Vous avez **"+coins.toString()+" :coin:**")
                .addFields(             
                    { name: "__**Grade Dream Team**__ *(220:coin:/mois)* "+shopdico[interaction.user.id]["Grades"][0]+"x", value: "*- Création de sondages\n- Salon Dream Team exclusif\n- 1 mini-jeu en + disponible*"},
                    { name: "__**Grade Dream Team +**__ *(467:coin:/mois)* "+shopdico[interaction.user.id]["Grades"][1]+"x", value: "*- Tous les avantages de Dream Team\n- Création de sondages et d'évènements\n- Couleur du pseudo personalisable\n- Double vote de popularité\n- Salon exclu pour les Dream Team +*"},
                    { name: "__**Grade Super Dream Team**__ *(1182:coin:/mois)* "+shopdico[interaction.user.id]["Grades"][2]+"x", value: "*- Tous les avantages de Dream Team et Dream Team +\n- Renommer son pseudo\n- Salon exclu pour les Super Dream Team*"}
                )

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shop_dreamteam')
                        .setLabel('🍉')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shop_dreamteam+')
                        .setLabel('🍉+')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shop_superdreamteam')
                        .setLabel('Super 🍉')
                        .setStyle(ButtonStyle.Secondary),
                );
            interaction.user.send({ embeds: [exampleEmbed], components: [row], fetchReply: true  })
            interaction.reply("Commande utilisée, veuillez regarder vos MP")
        }

        if(interaction.commandName === "fight"){
            if (interaction.member.roles.cache.has(adminrole.id) === true) {
                let file = editJsonFile("./fight.json")
                var fightdico = file.get("Saisons")
                if(!fightdico[fightdico["Number"].toString()]) {
                    fightdico[fightdico["Number"].toString()] = {"Joueurs":8,"ManchesQ":3,"Victoire":"Points"}
                }
                file.set("Saisons",fightdico)
                file.save()
                interaction.reply("Veuillez regarder vos MP pour paramétrer la prochaine saison")

                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle("**Informations de la saison "+fightdico["Number"].toString()+" de Fight Discord**")
                    .setDescription("*Les joueurs manquants seront remplacés par des IA. Le gagnant de la saison gagne.*")
                    .addFields(             
                        { name: "**JOUEURS :** "+fightdico[fightdico["Number"].toString()]["Joueurs"].toString(), value: "4, 8, 16 ou 32"},
                        { name: "**MANCHES QUALIFICATIONS :** "+fightdico[fightdico["Number"].toString()]["ManchesQ"].toString(), value: "3 ou 5"},
                        { name: "**CONDITION VICTOIRE :** "+fightdico[fightdico["Number"].toString()]["Victoire"], value: "Points ou Kills"}
                    )

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_players')
                            .setLabel('JOUEURS')
                            .setStyle(ButtonStyle.Secondary),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_manches')
                            .setLabel('MANCHES Q')
                            .setStyle(ButtonStyle.Secondary),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_victoire')
                            .setLabel('VICTOIRE')
                            .setStyle(ButtonStyle.Secondary),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_launch')
                            .setLabel('⚔️ Lancer')
                            .setStyle(ButtonStyle.Danger),
                    );
                interaction.user.send({ embeds: [exampleEmbed], components: [row], fetchReply: true  })

            } else {
                interaction.reply("Vous n'avez pas le rôle **"+adminrole.name+"** pour executer cette commande.");
            }
        }

        if(interaction.commandName === "fightlead"){
            let file = editJsonFile("./fight.json");
            var membersdico = file.get("Saisons")["Wins"];

            var membersnbr = 0; // NUMBER OF MEMBERS
            for (var i in membersdico) {
            if (membersdico.hasOwnProperty(i)) membersnbr++;
            }

            var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
            for (var i in membersdico) {
                classementarray.push([membersdico[i],i])
            }
            classementarray.sort((function(index) {
                return function(a, b) {
                    return (a[index] === b[index] ? 0 : (a[index] < b[index] ? 1 :-1));
                };
            })(0));

            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle(":crossed_swords:  **__Classement des gagnants de FIGHT DISCORD :__**")

            if (membersnbr > 20) {
                membersnbr = 20
            }
            var place_array = [":first_place:",":second_place:",":third_place:",":four:",":five:",":six:",":seven:",":eight:",":nine:",":keycap_ten:","11","12","13","14","15","16","17","18","19","20","21","22"]

            for (let i = 1; i <= membersnbr; i++) {
                var user = classementarray[i-1][1]
                var pseudo = ""

                if (user.includes("IA") == false) {
                    let usered = await client.users.fetch(classementarray[i-1][1])
                    pseudo = usered.username
                } else {
                    pseudo = classementarray[i-1][1]
                }

                exampleEmbed.addFields({ name: place_array[i-1]+" **|** "+pseudo, value: " "+":star:".repeat(membersdico[classementarray[i-1][1]]), inline: true })
            }

            interaction.reply({ embeds: [exampleEmbed] });
        }

    } else if (interaction.isSelectMenu()) {
        if (interaction.customId === "jeu_selection") {
            if (interaction.values[0] === "jp") {
                game_jp(interaction.user)
            }
            if (interaction.values[0] == "pfc") {
                game_pfc(interaction.user)
            }
            if (interaction.values[0] == "p4") {
                game_p4(interaction.user)
            }
            interaction.deferUpdate()
        }
    } else if (interaction.isButton()) {
        let file2 = editJsonFile("./shop.json")
        var shopdico = file2.get("Members")

        let file = editJsonFile("./infos.json")
        var membersdico = file.get("members")

        let file3 = editJsonFile("./fight.json")
        var fightdico = file3.get("Saisons")

        if (interaction.customId === "fight_players") {
            if (fightdico[fightdico["Number"].toString()]["Joueurs"] === 4) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 8
            }
            else if (fightdico[fightdico["Number"].toString()]["Joueurs"] === 8) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 16
            }
            else if (fightdico[fightdico["Number"].toString()]["Joueurs"] === 16) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 32
            }
            else if (fightdico[fightdico["Number"].toString()]["Joueurs"] === 32) {
                fightdico[fightdico["Number"].toString()]["Joueurs"] = 4
            }
            file3.set("Saisons",fightdico)
            file3.save()
            embed_fight(interaction.message)
            interaction.deferUpdate()
        }

        if (interaction.customId === "fight_manches") {
            if (fightdico[fightdico["Number"].toString()]["ManchesQ"] === 3) {
                fightdico[fightdico["Number"].toString()]["ManchesQ"] = 5
            }
            else if (fightdico[fightdico["Number"].toString()]["ManchesQ"] === 5) {
                fightdico[fightdico["Number"].toString()]["ManchesQ"] = 3
            }
            file3.set("Saisons",fightdico)
            file3.save()
            embed_fight(interaction.message)
            interaction.deferUpdate()
        }

        if (interaction.customId === "fight_victoire") {
            if (fightdico[fightdico["Number"].toString()]["Victoire"] === "Points") {
                fightdico[fightdico["Number"].toString()]["Victoire"] = "Kills"
            }
            else if (fightdico[fightdico["Number"].toString()]["Victoire"] === "Kills") {
                fightdico[fightdico["Number"].toString()]["Victoire"] = "Points"
            }
            file3.set("Saisons",fightdico)
            file3.save()
            embed_fight(interaction.message)
            interaction.deferUpdate()
        }

        if (interaction.customId === "fight_launch") {
            fightdico[fightdico["Number"].toString()]["Inscriptions"] = []
            file3.set("Saisons",fightdico)
            file3.save()
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('fight_inscriptions')
                        .setLabel('⚔️ INSCRIVEZ-VOUS')
                        .setStyle(ButtonStyle.Danger),
                )
            client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({content:"**FIGHT DISCORD SAISON "+fightdico["Number"].toString()+"** ("+fightdico[fightdico["Number"].toString()]["Inscriptions"].length.toString()+"/"+fightdico[fightdico["Number"].toString()]["Joueurs"].toString()+")",components: [row]})
            
            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('fight_start')
                        .setLabel('⚔️ Lancer la saison')
                        .setStyle(ButtonStyle.Danger),
                )

            interaction.user.send({content:"**FIGHT DISCORD SAISON "+fightdico["Number"].toString()+"**",components: [row2]})

            interaction.deferUpdate()
        }
        
        if (interaction.customId === "fight_inscriptions") {
            if (fightdico[fightdico["Number"].toString()]["Inscriptions"].includes(interaction.user.id) == false) {
                fightdico[fightdico["Number"].toString()]["Inscriptions"].push(interaction.user.id)
                file3.set("Saisons",fightdico)
                file3.save()
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('fight_inscriptions')
                            .setLabel('⚔️ INSCRIVEZ-VOUS')
                            .setStyle(ButtonStyle.Danger),
                    )
                interaction.message.edit({content:"**FIGHT DISCORD SAISON "+fightdico["Number"].toString()+"** ("+fightdico[fightdico["Number"].toString()]["Inscriptions"].length.toString()+"/"+fightdico[fightdico["Number"].toString()]["Joueurs"].toString()+")",components: [row]})
            }
            interaction.deferUpdate()
        }

        if (interaction.customId === "fight_start") {
            var ia_nbr = 0
            while (fightdico[fightdico["Number"].toString()]["Inscriptions"].length < fightdico[fightdico["Number"].toString()]["Joueurs"]) {
                ia_nbr += 1
                fightdico[fightdico["Number"].toString()]["Inscriptions"].push("IA"+ia_nbr.toString())
                file3.set("Saisons",fightdico)
                file3.save()
            }

            ia_nbr = 0
            const exampleEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle("**Saison 1 de Fight Discord**")
                .setDescription("*Voici le tableau des joueurs, qui joueront dans cette saison.*")
                .setFooter({ text: 'Lancement dans 1h - avec intervale de 10 mins.'});
            var max = fightdico[fightdico["Number"].toString()]["Joueurs"]
            var text = ""
            var text2 = ""
            var text3 = ""
            var text4 = ""
            for (let i = 0; i < max; i++) {
                if (fightdico[fightdico["Number"].toString()]["Inscriptions"][i].includes("IA") == false) {
                    user = await client.users.fetch(fightdico[fightdico["Number"].toString()]["Inscriptions"][i])
                    if (i >= 0 && i < 10) {
                        text += "**"+user.username+"** *(Joueur)*\n"
                    } else if (i >= 10 && i < 20) {
                        text2 += "**"+user.username+"** *(Joueur)*\n"
                    } else if (i >= 20 && i < 30) {
                        text3 += "**"+user.username+"** *(Joueur)*\n"
                    } else if (i >= 30 && i < 32) {
                        text4 += "**"+user.username+"** *(Joueur)*\n"
                    } 
                } else {
                    ia_nbr += 1
                    if (i >= 0 && i < 10) {
                        text += "**IA"+ia_nbr.toString()+"** *(IA)*\n"
                    } else if (i >= 10 && i < 20) {
                        text2 += "**IA"+ia_nbr.toString()+"** *(IA)*\n"
                    } else if (i >= 20 && i < 30) {
                        text3 += "**IA"+ia_nbr.toString()+"** *(IA)*\n"
                    } 
                    else if (i >= 30 && i < 32) {
                        text4 += "**IA"+ia_nbr.toString()+"** *(IA)*\n"
                    } 
                }
            }
            exampleEmbed.addFields({ name: "1-10", value: text, inline: true})
            if (text2 != "") {
                exampleEmbed.addFields({ name: "11-20", value: text2, inline: true})
            }
            if (text3 != "") {
                exampleEmbed.addFields({ name: "21-30", value: text3, inline: true})
            }
            if (text4 != "") {
                exampleEmbed.addFields({ name: "31-32", value: text4, inline: true})
            }
            client.guilds.cache.get(guild_id).channels.cache.get("976917009717674054").send({embeds: [exampleEmbed]})
            start_fight_qualifs()
            interaction.deferUpdate()
        }
        if (interaction.customId === "coucou") {
            interaction.reply("<@"+interaction.user.id+"> te fais un coucou !")
        }
        if (interaction.customId === "shop_dreamteam") {
            if (membersdico[interaction.user.id]["esheep"] >= 220) {
                interaction.reply("Dream Team acheté avec succès. (-220:coin:)")
                shopdico[interaction.user.id]["Grades"][0] += 1
                membersdico[interaction.user.id]["esheep"] -= 220
                file2.set("Members",shopdico)
                file2.save()
                file.set("members",membersdico)
                file.save()
            } else {
                interaction.reply("Echec. Vous n'avez pas assez de :coin:")
            }
        }
        if (interaction.customId === "shop_dreamteam+") {
            if (membersdico[interaction.user.id]["esheep"] >= 467) {
                interaction.reply("Dream Team + acheté avec succès. (-467:coin:)")
                shopdico[interaction.user.id]["Grades"][1] += 1
                membersdico[interaction.user.id]["esheep"] -= 467
                file2.set("Members",shopdico)
                file2.save()
                file.set("members",membersdico)
                file.save()
            } else {
                interaction.reply("Echec. Vous n'avez pas assez de :coin:")
            }
        }
        if (interaction.customId === "shop_superdreamteam") {
            if (membersdico[interaction.user.id]["esheep"] >= 1182) {
                interaction.reply("Super Dream Team acheté avec succès. (-1182:coin:)")
                shopdico[interaction.user.id]["Grades"][2] += 1
                membersdico[interaction.user.id]["esheep"] -= 1182
                file2.set("Members",shopdico)
                file2.save()
                file.set("members",membersdico)
                file.save()
            } else {
                interaction.reply("Echec. Vous n'avez pas assez de :coin:")
            }
        }
        if (interaction.customId === "pierre_button") {
            game_pfc(interaction.user,1)
            interaction.deferUpdate()
        }
        if (interaction.customId === "feuille_button") {
            game_pfc(interaction.user,2)
            interaction.deferUpdate()
        }
        if (interaction.customId === "ciseaux_button") {
            game_pfc(interaction.user,3)
            interaction.deferUpdate()
        }
        if (interaction.customId === "pfc_rematch") {
            game_pfc(interaction.user,1)
        }
        if (interaction.customId === "jp_rematch") {
            game_jp(interaction.user)
        }
        if (interaction.customId === "xplead_+") {
            xp_lead(2,interaction)
        }
        if (interaction.customId === "xplead_-") {
            xp_lead(1,interaction)
        }
    }
});

async function leads(page,interaction,mode) {

    let file_lead = editJsonFile("./leads.json");
    var lead_dico = file_lead.get("lead")

    let file = editJsonFile(lead_dico[mode]["file"]);
    var membersdico = file.get(lead_dico[mode]["dico"])
    if (membersdico[lead_dico[mode]["dico_ext"]] != null) {
        membersdico = membersdico[lead_dico[mode]["dico_ext"]]
    }

    if (page > Math.floor(Object.keys(membersdico).length/9)+1) {
        page = Math.floor(Object.keys(membersdico).length/9)+1
    }

    var membersnbr = 0; // NUMBER OF MEMBERS
    var classementarray = []; // FAIRE LE CLASSEMENT AVEC [id, nombre d'xp]
    for (var i in membersdico) {
        if (membersdico.hasOwnProperty(i)) {
            membersnbr++;
            var value =  membersdico[i]
            if (lead_dico[mode]["value_lead"] != "") {
                value = value[lead_dico[mode]["value_lead"]]
            }
            classementarray.push([value,i])
        }
    }

    classementarray.sort((function(index) {
        return function(a, b) {
            return (a[index] === b[index] ? 0 : (a[index] < b[index] ? 1 :-1));
        };
    })(0));

    classementarray = classementarray.slice((page-1)*9, page*9)

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(lead_dico[mode]["title"])
        .setDescription(lead_dico[mode]["description"])
        .setFooter({ text: 'Page '+page.toString()+' / '+(Math.floor(Object.keys(membersdico).length/9)+1).toString()});

    var place_array = [":first_place:",":second_place:",":third_place:","4","5","6","7","8","9","10"]

    for (let i = 1; i <= classementarray.length; i++) {
        let user = await client.users.fetch(classementarray[i-1][1])
        let membered = user

        var personne = membered

        if (membered === undefined) {
            personne = "membre non connu"
        } else {
            personne = membered.username
        }
        var desc = lead_dico[mode]["value1_text"][0]+(classementarray[i-1][0]).toString()+lead_dico[mode]["value1_text"][1]
        if (mode == "xp_lead") {
            var max_xp_to_level = 5*(Math.pow(membersdico[membered.id][lead_dico[mode]["value2_lead"]], 2))+(50*membersdico[membered.id][lead_dico[mode]["value2_lead"]])+100
            desc = lead_dico[mode]["value1_text"][0]+(membersdico[membered.id][lead_dico[mode]["value2_lead"]]).toString()+lead_dico[mode]["value1_text"][1]+" "+lead_dico[mode]["value2_text"][0]+(classementarray[i-1][0]).toString()+"/"+max_xp_to_level.toString()+lead_dico[mode]["value2_text"][1]
        }
        if (mode == "voices_lead") {
            var date = new Date(null);
            date.setSeconds(classementarray[i-1][0]); // specify value for SECONDS here
            var result = date.toISOString().substr(11, 8);
            desc = lead_dico[mode]["value1_text"][0]+(result).toString()+lead_dico[mode]["value1_text"][1]
        }
        if (page == 1) {
            exampleEmbed.addFields({ name: place_array[i-1]+" **|** "+personne, value: desc, inline: true })
        } else {
            exampleEmbed.addFields({ name: (i+9*(page-1)).toString()+" **|** "+personne, value: desc, inline: true })
        }
    }
    interaction.editReply({content: "", embeds: [exampleEmbed] })
}

function embed_fight(message) {
    let file = editJsonFile("./fight.json")
    var fightdico = file.get("Saisons")

    const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle("**Informations de la saison 1 de Fight Discord**")
        .setDescription("*Les joueurs manquants seront remplacés par des IA. Le gagnant de la saison gagne.*")
        .addFields(             
            { name: "**JOUEURS :** "+fightdico[fightdico["Number"].toString()]["Joueurs"].toString(), value: "4, 8, 16 ou 32"},
            { name: "**MANCHES QUALIFICATIONS :** "+fightdico[fightdico["Number"].toString()]["ManchesQ"].toString(), value: "3 ou 5"},
            { name: "**CONDITION VICTOIRE :** "+fightdico[fightdico["Number"].toString()]["Victoire"], value: "Points ou Kills"}
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('fight_players')
                .setLabel('JOUEURS')
                .setStyle(ButtonStyle.Secondary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('fight_manches')
                .setLabel('MANCHES Q')
                .setStyle(ButtonStyle.Secondary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('fight_victoire')
                .setLabel('VICTOIRE')
                .setStyle(ButtonStyle.Secondary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('fight_launch')
                .setLabel('⚔️ Lancer')
                .setStyle(ButtonStyle.Danger),
        );

    message.edit({ embeds: [exampleEmbed], components: [row], fetchReply: true  })
}

function game_jp(user) {
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");

    // Si le joueur n'a pas le jeu de lancé
    if(!membersdico[user.id]) {
        membersdico[user.id] = {"game_name":"juste_prix","essais":0,"result":Math.floor(Math.random() * 1000)+1,"gain":1.5}
        const exampleEmbed = new EmbedBuilder()
        .setColor(10181046)
        .setTitle(":coin: **__Bienvenue au Juste Prix__**")
        .setDescription('Veuillez entrer un nombre entre 1 et 1000 sur le tchat.')
        user.send({ embeds: [exampleEmbed] });
        file.set("games",membersdico)
        file.save()
    }

    var in_game = true
    var number_bot = 0
    var number_placed = 0
    if (membersdico[user.id]) {
        if (membersdico[user.id]["result"]) {
            number_bot = membersdico[user.id]["result"]
        }
    }
    if (typeof user !== 'undefined' && user.id != "1005618783500644372") {
        user.createDM().then(async (channel) => {
             channel.messages.fetch({ limit: 1 }).then(messages => {
                let lastMessage = messages.first();
                if (lastMessage.author.id != "1005618783500644372") {
                    // SI ENCORE ESSAIS
                    if (!isNaN(lastMessage.content)) {
                        number_bot = membersdico[user.id]["result"]
                        number_placed = parseInt(lastMessage.content)
                        if (number_placed > 0 && number_placed < 1001) {
                            // SI PAS LE BON NOMBRE
                            if (number_placed != number_bot) {
                                membersdico[user.id]["essais"] += 1
                                membersdico[user.id]["gain"] = Math.floor((membersdico[user.id]["gain"] - 0.1)*10)/10
                                if (membersdico[user.id]["gain"] < 0) {
                                    membersdico[user.id]["gain"] = 0
                                }
                                file.set("games",membersdico)
                                file.save()
                                if (number_placed > number_bot) {
                                    user.send("**Plus petit...**\nVous êtes à "+membersdico[user.id]["essais"]+" essais. *En jeu : "+membersdico[user.id]["gain"]+" :coin:*")
                                }
                                if (number_placed < number_bot) {
                                    user.send("**Plus grand...**\nVous êtes à "+membersdico[user.id]["essais"]+" essais. *En jeu : "+membersdico[user.id]["gain"]+" :coin:*")
                                }
                            } else {
                                const exampleEmbed = new EmbedBuilder()
                                .setColor(10181046)
                                .setTitle(":tada: **__Félicitations__**")
                                .setDescription('Vous avez trouvé le nombre '+number_bot+" en "+(membersdico[user.id]["essais"]+1)+" essais.")
                                .addFields(
                                    { name: 'Gains récupérés', value: +membersdico[user.id]["gain"]+' :coin:' }
                                )
                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('jp_rematch')
                                            .setLabel('REJOUER')
                                            .setStyle(ButtonStyle.Danger),
                                    )
                                user.send({ embeds: [exampleEmbed], components: [row] })
                                var coinsdico = file.get("members");
                                coinsdico[user.id]["esheep"] += membersdico[user.id]["gain"]
                                delete membersdico[user.id]
                                file.set("games",membersdico)
                                file.set("members",coinsdico)
                                file.save()
                            }
                        } else {
                            user.send("Veuillez plutôt entrer un nombre entre 1 et 1000 s'il vous plait. (erreur : nombre non compris)")
                        }
                    } else {
                        user.send("Veuillez plutôt entrer un nombre entre 1 et 1000 s'il vous plait. (erreur : n'est pas un nombre)")
                    }
                }

                    
            })
            .catch(console.error);
                
        })


    }
}

async function game_pfc(user,nbr) {
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");
    var coinsdico = file.get("members");
    var itemgame = ["pierre","feuille","ciseaux"]
    // Si le joueur n'a pas le jeu de lancé
    if(!membersdico[user.id]) {
        membersdico[user.id] = {"game_name":"pierre_feuille_ciseaux","game":1,"points":0,"result":Math.floor(Math.random() * (2 - 0 + 1) + 0),"gain":0}
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Pierre Feuille Ciseaux__**")
            .setDescription('Il faut savoir que je choisis mon objet quand la manche démarre, pas de soucis à se faire !.')
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('pierre_button')
					.setLabel('🗿 Pierre')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('feuille_button')
					.setLabel('🧻 Feuille')
					.setStyle(ButtonStyle.Secondary),
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('ciseaux_button')
					.setLabel('✂️ Ciseaux')
					.setStyle(ButtonStyle.Secondary),
			);

        await user.send({ embeds: [exampleEmbed], components: [row]  });
        file.set("games",membersdico)
        file.save()
    } else {

        var in_game = true
        var item_bot = itemgame[membersdico[user.id]["result"]]
        var item_user = itemgame[nbr-1]
        var number_placed = 0



        if (item_user === item_bot) { // SI c'est le même objet
            user.send("Oh bah c'est marrant, on a le même objet "+item_bot+".")
        } else {
            if (item_user === "feuille" && item_bot === "pierre") {// SI FEUILLE VS PIERRE
                membersdico[user.id]["points"] += 1
                membersdico[user.id]["gain"] += 0.3
                user.send("**Feuille** contre **Pierre**, vous avez gagné cette manche.")
            }
            if (item_user === "pierre" && item_bot === "feuille") {// SI PIERRE VS PAPIER
                user.send("**Pierre** contre **Feuille**, vous avez perdu cette manche.")
            }
            if (item_user === "feuille" && item_bot === "ciseaux") {// SI FEUILLE VS CISEAUX
                user.send("**Feuille** contre **Ciseaux**, vous avez perdu cette manche.")
            }
            if (item_user === "ciseaux" && item_bot === "feuille") {// SI CISEAUX VS FEUILLE
                membersdico[user.id]["points"] += 1
                membersdico[user.id]["gain"] += 0.3
                user.send("**Ciseaux** contre **Feuille**, vous avez gagné cette manche.")
            }
            if (item_user === "ciseaux" && item_bot === "pierre") {// SI CISEAUX VS PIERRE
                user.send("**Ciseaux** contre **Pierre**, vous avez perdu cette manche.")
            }
            if (item_user === "pierre" && item_bot === "ciseaux") {// SI PIERRE VS CISEAUX
                membersdico[user.id]["points"] += 1
                membersdico[user.id]["gain"] += 0.3
                user.send("**Pierre** contre **Ciseaux**, vous avez gagné cette manche.")
            }
            membersdico[user.id]["game"] += 1
            file.set("games",membersdico)
            file.save()
        }
        membersdico[user.id]["result"] = Math.floor(Math.random() * (2 - 0 + 1) + 0)
        file.set("games",membersdico)
        file.save()

        if (membersdico[user.id]["game"] > 5) {
            if (membersdico[user.id]["points"] >= 3) {
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(":tada: **__Félicitations__**")
                    .setDescription("Vous m'avez battu dans cette partie. Vous avez remporté "+membersdico[user.id]["points"]+" manches c'est ENORME !")
                    .addFields(
                        { name: 'Gains récupérés', value: +membersdico[user.id]["gain"]+' :coin:' }
                    )
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('pfc_rematch')
                            .setLabel('REJOUER (marche pas trop)')
                            .setStyle(ButtonStyle.Danger),
                    )
                user.send({ embeds: [exampleEmbed]})
            } else {
                membersdico[user.id]["gain"] = 0
                const exampleEmbed = new EmbedBuilder()
                    .setColor(10181046)
                    .setTitle(":cry:  **__Mince...__**")
                    .setDescription("Vous m'avez pas battu dans cette partie. Vous avez remporté "+membersdico[user.id]["points"]+" manches contre 3 requises.")
                    .addFields(
                        { name: 'Gains récupérés', value: +membersdico[user.id]["gain"]+' :coin:' }
                    )
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('pfc_rematch')
                            .setLabel('REJOUER (marche pas trop)')
                            .setStyle(ButtonStyle.Danger),
                    )
                user.send({ embeds: [exampleEmbed]})
            }
            coinsdico[user.id]["esheep"] += membersdico[user.id]["gain"]
            file.set("members",coinsdico)
            delete membersdico[user.id]
            file.set("games",membersdico)
            file.save()
        } else {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pierre_button')
                        .setLabel('🗿 Pierre')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('feuille_button')
                        .setLabel('🧻 Feuille')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ciseaux_button')
                        .setLabel('✂️ Ciseaux')
                        .setStyle(ButtonStyle.Secondary),
                );

            user.send({ content : '___\n**NOUVELLE MANCHE**\n', components: [row]  })
        }
    }
}

function game_p4(user) {
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");
    var coinsdico = file.get("members");
    var itemgame = ["pierre","feuille","ciseaux"]
    var victory = false
    // Si le joueur n'a pas le jeu de lancé
    if(!membersdico[user.id]) {
        membersdico[user.id] = {"game_name":"puissance_4","selection":0,"x":-1,"y":-1,"grille":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],"gain":0}
        const exampleEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setTitle(":coin: **__Bienvenue au Puissance 4__**")
            .setDescription("Veuillez entrer la position de votre pion, de 1 à 7.")
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_1')
                    .setLabel('1')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_2')
                    .setLabel('2')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_3')
                    .setLabel('3')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_4')
                    .setLabel('4')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_5')
                    .setLabel('5')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_6')
                    .setLabel('6')
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('p4_7')
                    .setLabel('7')
                    .setStyle(ButtonStyle.Secondary),
            );
        user.send({ embeds: [exampleEmbed]});
        show_puissance_4(user,membersdico[user.id]["grille"])
        file.set("games",membersdico)
        file.save()
    }

    var in_game = true
    var item_bot = itemgame[membersdico[user.id]["result"]]
    var number_placed = 0

    if (typeof user !== 'undefined' && user.id != "1005618783500644372") {
        user.createDM().then(async (channel) => {
             channel.messages.fetch({ limit: 1 }).then(messages => {
                let lastMessage = messages.first();
                lastMessage.content = lastMessage.content.toLowerCase()
                if (lastMessage.author.id != "1005618783500644372") {
                    // SI ENCORE ESSAIS
                    if (!isNaN(lastMessage.content)) {
                        if (lastMessage.content > 0 && lastMessage.content <= 7-membersdico[user.id]["selection"]) {
                            let placements = place_puissance_4(user,1,lastMessage.content)
                            membersdico[user.id]["grille"] = placements[0]
                            membersdico[user.id]["selection"] = placements[1]
                            file.set("games",membersdico)
                            file.save()
                            var x = placements[2]
                            detect_victory_puissance_4(user,1,membersdico[user.id]["grille"],x,lastMessage.content)
                        } else {
                            user.send("Veuillez plutôt entrer un chiffre entre 0 et "+(7-membersdico[user.id]["selection"]).toString()+" s'il vous plait. (erreur : n'est pas inclus)")
                        }
                    } else {
                        user.send("Veuillez plutôt entrer un chiffre entre 0 et "+(7-membersdico[user.id]["selection"]).toString()+" s'il vous plait. (erreur : n'est pas un chiffre)")
                    }

                    if (membersdico[user.id]["selection"] == -1) {
                        user.send("Colonne trop remplie.")
                        show_puissance_4(user,membersdico[user.id]["grille"])
                        membersdico[user.id]["selection"] = 0
                        file.set("games",membersdico)
                        file.save()
                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_1')
                                    .setLabel('1')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_2')
                                    .setLabel('2')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_3')
                                    .setLabel('3')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_4')
                                    .setLabel('4')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_5')
                                    .setLabel('5')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_6')
                                    .setLabel('6')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_7')
                                    .setLabel('7')
                                    .setStyle(ButtonStyle.Secondary),
                            );
                        user.send({ content: "Veuillez entrer la position de votre pion, de 1 à 7."});
                    }

                    if (membersdico[user.id]["selection"] > 0) {
                        user.send("C'est à mon tour, le place mon pion.")
                        var ia = Math.floor(Math.random() * 4) + 1
                        var placements = null
                        if (ia <= 1) {
                            placements = place_puissance_4(user,2,Math.floor(Math.random() * 7) + 1)
                        } else if (ia === 2) {
                            placements = place_puissance_4(user,2,lastMessage.content)
                        } else if (ia === 3) {
                            placements = place_puissance_4(user,2,lastMessage.content+1)
                        } else if (ia >= 4) {
                            placements = place_puissance_4(user,2,lastMessage.content-1)
                        }
                        var x = placements[2]
                        var y = placements[3]
                        detect_victory_puissance_4(user,2,membersdico[user.id]["grille"],x,y)
                        membersdico[user.id]["grille"] = placements[0]
                        //membersdico[user.id]["selection"] = placements[1]
                        file.set("games",membersdico)
                        file.save()
                        show_puissance_4(user,membersdico[user.id]["grille"])
                        membersdico[user.id]["selection"] = 0
                        file.set("games",membersdico)
                        file.save()

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_1')
                                    .setLabel('1')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_2')
                                    .setLabel('2')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_3')
                                    .setLabel('3')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_4')
                                    .setLabel('4')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_5')
                                    .setLabel('5')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_6')
                                    .setLabel('6')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('p4_7')
                                    .setLabel('7')
                                    .setStyle(ButtonStyle.Secondary),
                            );
                        user.send({ content: "A ton tour ! Veuillez entrer la position de votre pion, de 1 à 7."});
                    }
                    
                }
                    
            })
            .catch(console.error);
                
        })

    }
}

function place_puissance_4(user,player,pos) { // pos de 0 à 6 ligne de 0 à 5
    let file = editJsonFile("./infos.json");
    var membersdico = file.get("games");
    var posed = false
    var ligne = 5
    var placements = 1
    pos = pos - 1
    while (posed === false) {
        if (pos < 0) {
            pos = 0
        }
        if (pos > 6) {
            pos = 6
        }
        if (ligne <= 0) {
            if (player == 2) {
                ligne = 5
                pos += 1
            } else {
                posed = true
                placements = -1
            }
        }
        if (player == 2) {
            if (pos > 6) {
                pos = 0
            }
        }
        if (membersdico[user.id]["grille"][ligne][pos] === 0) {
            membersdico[user.id]["grille"][ligne][pos] = player
            posed = true
        } else {
            ligne -= 1
        }
    }
    return [membersdico[user.id]["grille"],placements,ligne,pos];
}

function detect_victory_puissance_4(user,player,grille,posx,posy) {
    console.log("x : "+posx+" | y : "+posy)
    var victory = false
    var count = 0
    console.log("Player"+player)
    // COMPTER EN LIGNE
    for (let c = 0; c < 6; c++) {
        if (grille[posx][c] === player) {
            count += 1
        } else {
            if (count < 4) {
                count = 0
            }
        }
    }
    // COMPTER EN COLONNES
    for (let l = 0; l < 5; l++) {
        if (grille[l][posy] === player) {
            count += 1
        } else {
            if (count < 4) {
                count = 0
            }
        }
    }
    if (count >= 4) {
        user.send("C'est gagné")
        console.log("Gagné")
        console.log("Victoire :",player)
        return player;
    }
    user.send("C'est perdu")
    console.log("Victoire : 0")
    return 0;
}

function show_puissance_4(user,grille) {
    console.log(grille)
    var grille_to_send = "**La grille**"
    for (let i = 0; i < grille[0].length-1; i++) {
        for (let j = 0; j < grille[i].length; j++) {
            if (j === 0) {
                grille_to_send += "\n"
            }
            if (grille[i][j] === 0) {
                grille_to_send += " :white_medium_small_square: "
            } else if (grille[i][j] === 1) {
                grille_to_send += " :red_square: "
            } else if (grille[i][j] === 2) {
                grille_to_send += " :blue_square: "
            } else {
                grille_to_send += " :green_square: "
            }
        }
    }
    grille_to_send += "\n <:poll1:1017112408248041543>  <:poll2:1017113079869341818>  <:poll3:1017113080989221016>  <:poll4:1017113694854979674>  <:poll5:1017113696130060348>  <:poll6:1017113697166041108>  <:poll7:1017114267356504114>"
    user.send(grille_to_send)
}

client.on(Events.MessageReactionRemove, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

    if (reaction.message.author.id == '1005618783500644372'){
        if (reaction.message.embeds.length >= 1) {

            if (reaction.message.embeds[0]["data"]["title"].startsWith(":bell:") === true) {
                var role = null
                if (reaction.emoji.name === "📊") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "940294485940781177")
                }
                if (reaction.emoji.name === "🔴") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "940294478038696006")
                }
                if (reaction.emoji.name === "🏆") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "940294130850988082")
                }
                if (reaction.emoji.name === "🍺") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "946429189630881872")
                }
                if (role != null) {
                    const member = client.guilds.cache.get(guild_id).members.cache.get(user.id)
                    member.roles.remove(role).catch(console.error);
                }
            }

            if (reaction.message.embeds[0]["data"]["title"].startsWith(":moneybag:") === true) {
                var config = require("./infos.json");
                let file = editJsonFile("./infos.json");
                var tirages_dic = file.get("tirages")
                var members_dic = file.get("members")
                if (tirages_dic[reaction.message.id]) {
                    if (!tirages_dic[reaction.message.id]["participate"]) {
                        tirages_dic[reaction.message.id][participate] = []
                    }
                    var index = tirages_dic[reaction.message.id]["participate"].indexOf(user.id);
                    if (index !== -1) {
                        tirages_dic[reaction.message.id]["participate"].splice(index, 1);
                    }
                    file.set("tirages",tirages_dic);
                    file.save()
                }
            }
        }
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

    if (reaction.message.author.id == '1005618783500644372'){
        if (reaction.message.embeds.length >= 1) {
            if (reaction.message.embeds[0]["data"]["title"].startsWith(":bell:") === true) {
                var role = null
                if (reaction.emoji.name === "📊") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "940294485940781177")
                }
                if (reaction.emoji.name === "🔴") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "940294478038696006")
                }
                if (reaction.emoji.name === "🏆") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "940294130850988082")
                }
                if (reaction.emoji.name === "🍺") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === "946429189630881872")
                }
                if (role != null) {
                    const member = client.guilds.cache.get(guild_id).members.cache.get(user.id)
                    member.roles.add(role).catch(console.error);
                }
            }

            if (reaction.message.embeds[0]["data"]["title"].startsWith(":moneybag:") === true) {
                var config = require("./infos.json");
                let file = editJsonFile("./infos.json");
                var tirages_dic = file.get("tirages")
                var members_dic = file.get("members")
                if (tirages_dic[reaction.message.id]) {
                    if (!tirages_dic[reaction.message.id]["participate"]) {
                        tirages_dic[reaction.message.id]["participate"] = []
                    }
                    if (user.id != "1005618783500644372" && user.id != tirages_dic[reaction.message.id]["author"]) {
                        tirages_dic[reaction.message.id]["participate"].push(user.id)
                    }
                    if (user.id == tirages_dic[reaction.message.id]["author"]) {
                        var gagnant_index = Math.floor(Math.random() * tirages_dic[reaction.message.id]["participate"].length)
                        var gagnant_id = tirages_dic[reaction.message.id]["participate"][gagnant_index].toString()
                        var prediction = await reaction.message.channel.messages.fetch(reaction.message.id)
                        var messagepredi = (await reaction.message.channel.messages.fetch(reaction.message.id)).embeds
                        messagepredi[0]["data"]["description"] = messagepredi[0]["data"]["description"].replace("Tirage au sort dès que l'auteur réponde.","Tirage au sort terminé, le gagnant est <@"+gagnant_id+">")
                        const exampleEmbed = new EmbedBuilder()
                            .setColor(10181046)
                            .setTitle(messagepredi[0]["data"]["title"])
                            .setDescription(messagepredi[0]["data"]["description"])
                        prediction.edit({ embeds: [exampleEmbed], fetchReply: true  })
                        if (gagnant_id != undefined) {
                            gagnant_user = client.users.cache.find(user => user.id === gagnant_id)
                            await gagnant_user.send("Vous venez de gagner le tirage au sort, vous gagnez **"+tirages_dic[reaction.message.id]["present"].toString()+"**")
                        }
                        delete tirages_dic[reaction.message.id]
                                
                    }
                    file.set("tirages",tirages_dic);
                    file.save()
                }
            }
        }
    }
});

if (test == 0) {
    client.login("MTAwNTYxODc4MzUwMDY0NDM3Mg.GYna_5.nJG-9ZdGD_US2nGLYlsxcoDjbOquxcikUPfMPI");
} else {
    client.login("MTA1OTkyNDk3ODk5MDA3MTgzMA.GNPZlk.khryXj0TckbWCQFC1Z8iX_jy-t87dE7zdZl9Rw");
}