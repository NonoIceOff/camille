const { Events } = require("discord.js");

const constantIDs = require("./constants/ids");

const { client, options } = require("./client");
const welcomeMessage = require("./misc/welcomeMessage");
const gamesCore = require("./games/core");
const bump = require("./misc/bump");
const xpSources = require("./xp/sources");
const roleMenu = require("./misc/roleMenu");
const giveaway = require("./misc/giveaway");
const commandsCore = require("./commands/core");

client.on(Events.ClientReady, async () => {
    if (false) {
        // TODO: Remake all of this
        adminrole = client.guilds.cache
            .get(guild_id)
            .roles.cache.get(constantIDs.roles.admin[test]);
        dreamteam = client.guilds.cache
            .get(guild_id)
            .roles.cache.get(constantIDs.roles.dreamTeam[test]);

        let votestart = new cron.CronJob("00 34 01 1 * *", startvote);
        votestart.start();
        let votestop = new cron.CronJob("00 00 00 2 * *", stopvote);
        votestop.start();
        let vidcheck = new cron.CronJob("00 00 20 * * *", newvid);
        vidcheck.start();
        let grades = new cron.CronJob("00 00 00 1 * *", givegrades);
        grades.start();
    }

    console.log("\x1b[32m", "Bot connecté ✓", "\x1b[0m");

    commandsCore.resetCommands();
});

client.on(Events.GuildMemberAdd, (member) => {
    welcomeMessage.sendWelcome(member);

    member.roles.add(constantIDs.roles.member[+options.test]); // Give the member role
});

client.on(Events.MessageCreate, async (message) => {
    gamesCore.onMessage(message);
    bump.bump(message);
    //xpSources.fromMessage(message);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(error);
            return;
        }
    }

    roleMenu.addRole(reaction, user);
    giveaway.checkIfFinished(reaction, user);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(error);
            return;
        }
    }

    roleMenu.removeRole(reaction, user);
});

client.on(Events.VoiceStateUpdate, (oldVoiceState, newVoiceState) => {
    // Listeing to the voiceStateUpdate event
    let file = editJsonFile("./infos.json");
    var voicemember = file.get("voice");
    var number_voices = 0;

    if (newVoiceState.member.voice.channel != null) {
        number_voices = newVoiceState.member.voice.channel.members.size;
    }

    if (newVoiceState.member.voice.selfMute == false && number_voices > 1) {
        // SI PAS MUTE
        if (newVoiceState.channel) {
            // The member connected to a channel.
            if (!voicemember[newVoiceState.member.user.id]) {
                // Si conexxion simple
                start_voicetime_to_user(newVoiceState.member.user);
            } else {
                // Si changement de salon simple
                stop_voicetime_to_user(newVoiceState.member.user);
                start_voicetime_to_user(newVoiceState.member.user);
            }
        } else if (oldVoiceState.channel) {
            // The member disconnected from a channel.
            if (voicemember[newVoiceState.member.user.id]) {
                stop_voicetime_to_user(newVoiceState.member.user);
            }
        }
    } else {
        // SI MUTE
        stop_voicetime_to_user(newVoiceState.member.user);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    commandsCore.callCommand(interaction);
    welcomeMessage.sayHi(interaction);
    gamesCore.onInteraction(interaction);
});
