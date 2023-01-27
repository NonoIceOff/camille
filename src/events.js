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
const leaderboard = require("./misc/leaderboard");
const youtube = require("./misc/youtube");
const inventory = require("./inventory/inventory");
const votes = require("./misc/votes");
const fight = require("./misc/fight");

function init() {
    client.on(Events.ClientReady, () => {
        youtube.startVideoListener();
        inventory.init();
        votes.initVotes();

        console.log("\x1b[32m", "Bot connecté ✓", "\x1b[0m");

        commandsCore.resetCommands();
    });

    client.on(Events.GuildMemberAdd, async (member) => {
        welcomeMessage.sendWelcome(member);

        await member.user.getXP(); // Register the user in the database
        await member.roles.add(constantIDs.roles.member[+options.test]); // Give the member role
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
        xpSources.fromVoice(oldVoiceState, newVoiceState);
    });

    client.on(Events.InteractionCreate, (interaction) => {
        commandsCore.callCommand(interaction);
        welcomeMessage.sayHi(interaction);
        gamesCore.onInteraction(interaction);
        leaderboard.onButton(interaction);
        fight.onButton(interaction);
    });
}
module.exports = { init };
