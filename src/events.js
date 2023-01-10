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

client.on(Events.ClientReady, () => {
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

client.on(Events.MessageCreate, (message) => {
    gamesCore.onMessage(message);
    bump.bump(message);
    xpSources.fromMessage(message);
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
    xpSources.fromVoice(oldVoiceState,newVoiceState)
});

client.on(Events.InteractionCreate, (interaction) => {
    commandsCore.callCommand(interaction);
    welcomeMessage.sayHi(interaction);
    gamesCore.onInteraction(interaction);
});
