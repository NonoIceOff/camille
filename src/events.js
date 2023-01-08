const { Events } = require("discord.js");

const { client, options } = require("./client");


client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => { // Listeing to the voiceStateUpdate event
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



client.on(Events.GuildMemberAdd, member => {
    var messagesdico = ["J'espère que tu as bien posé tes valises","Tu es au bon endroit !","Attention à Rémi, il est dangereux mdr","UN MAX D'APPLAUDISSEMENTS :clap:","Quel bonbon est toujours blasé ? Le choco-las","On m'a demandé d'écrire un message de bienvenue, sauf que j'ai la flemme.","Tu est tombé au bon endroit.","Si Foxus ne te dit pas bienvenue dans les 5 minutes, il aura le seum.","Oui, ceci est bien un message de bienvenue","Aladin débarque pour vous donner du bifle!","Connaissez-vous Twitch Prime ?","C'est bien une des premières étapes pour battre carakle (triple champion du monde de Fight).","Y'a aucun soucis si personne ne te dit bienvenue dès maintenant, c'est soit ils dorment soit ils dorment.","Solo, tête sous l'eau, j'me suis dit, C'est l'moment mets l'fire ! Fire","Tu viens d'emprunter le téléporteur mystère et es tombé dans le serveur"]
    var messagesdicoindex = Math.floor(Math.random() * messagesdico.length);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('coucou')
                .setLabel('👋 Fais coucou !')
                .setStyle(ButtonStyle.Danger),
        );
    client.guilds.cache.get(guild_id).channels.cache.get(constantIDs.channels.welcomeChannel[options.test]).send({content :"**<@"+member.id+"> bienvenue !** "+messagesdico[messagesdicoindex], components: [row]});
    member.roles.add(constantIDs.roles.member[options.test]);
});


client.on(Events.MessageCreate, async message => {

    //Si dans un jeu
    if (message.guild === null) {
        let file = editJsonFile("./infos.json");
        let fileg = editJsonFile("./infos.json");
        var gamesdico = fileg.get("games");
        var membersdico = file.get("members");
        if(message.author.id != client.user.id){
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

    if(!message.author.bot){
        if (message.channelId != constantIDs.channels.bot[options.test]) {
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
});



client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isChatInputCommand()){

        if(interaction.commandName === "options.test"){
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
            if (membre != interaction.user && !membre.bot) {
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
            if (interaction.channel == client.channels.cache.get(constantIDs.channels.bot[options.test])) {
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
            client.guilds.cache.get(guild_id).channels.cache.get(constantIDs.event.fightDiscord.channel[options.test]).send({content:"**FIGHT DISCORD SAISON "+fightdico["Number"].toString()+"** ("+fightdico[fightdico["Number"].toString()]["Inscriptions"].length.toString()+"/"+fightdico[fightdico["Number"].toString()]["Joueurs"].toString()+")",components: [row]})
            
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
            client.guilds.cache.get(guild_id).channels.cache.get(constantIDs.event.fightDiscord.channel[options.test]).send({embeds: [exampleEmbed]})
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

client.on(Events.MessageReactionRemove, async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

    if (reaction.message.author.bot){
        if (reaction.message.embeds.length >= 1) {

            if (reaction.message.embeds[0]["data"]["title"].startsWith(":bell:")) {
                var role = null
                if (reaction.emoji.name === "📊") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifPoll[options.test])
                }
                if (reaction.emoji.name === "🔴") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifVideo[options.test])
                }
                if (reaction.emoji.name === "🏆") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifEvent[options.test])
                }
                if (reaction.emoji.name === "🍺") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifShorts[options.test])
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

    if (reaction.message.author.bot){
        if (reaction.message.embeds.length >= 1) {
            if (reaction.message.embeds[0]["data"]["title"].startsWith(":bell:")) {
                var role = null
                if (reaction.emoji.name === "📊") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifPoll[options.test])
                }
                if (reaction.emoji.name === "🔴") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifVideo[options.test])
                }
                if (reaction.emoji.name === "🏆") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifEvent[options.test])
                }
                if (reaction.emoji.name === "🍺") {
                    role = client.guilds.cache.get(guild_id).roles.cache.find(r => r.id === constantIDs.roles.notifShorts[options.test])
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
                    if (!user.bot && user.id != tirages_dic[reaction.message.id]["author"]) {
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