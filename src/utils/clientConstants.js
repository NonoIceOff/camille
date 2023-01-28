const { Guild, Role } = require("discord.js");
const { client, options } = require("../client");

const ids = require("../constants/ids.json");

/**
 * @typedef Roles
 * @property {Role} admin
 * @property {Role} member
 * @property {Role} dreamTeam
 * @property {Role} dreamTeamPlus
 * @property {Role} superDreamTeam
 * @property {Role} notifPoll
 * @property {Role} notifVideo
 * @property {Role} notifEvent
 * @property {Role} notifShorts
 */

/**
 * @typedef Channels
 * @property {import("discord.js").Channel} shortPost
 * @property {import("discord.js").Channel} youtubePost
 * @property {import("discord.js").Channel} bot
 * @property {import("discord.js").Channel} welcomeChannel
 */

/**
 * @typedef Events
 * @property {{channel:import("discord.js").Channel}} fightDiscord
 */

/**
 * @type {{workingGuild:Guild,roles:Roles,channels:Channels,events:Events}}
 */
const constants = {};

/**
 * Init all Client constants.
 */
async function init() {
    const newConstants = {
        roles: {},
        channels: {},
        events: { fightDiscord: {} },
    };
    newConstants.workingGuild = await client.guilds.fetch(
        ids.workingGuild[+options.test]
    );
    Object.entries(ids.roles).forEach(async ([key, value]) => {
        newConstants.roles[key] = await newConstants.workingGuild.roles.fetch(
            value[+options.test]
        );
    });
    Object.entries(ids.channels).forEach(async ([key, value]) => {
        newConstants.channels[key] =
            await newConstants.workingGuild.channels.fetch(
                value[+options.test]
            );
    });
    newConstants.events.fightDiscord.channel =
        await newConstants.workingGuild.channels.fetch(
            ids.events.fightDiscord.channel[+options.test]
        );
    Object.assign(constants, newConstants);
}

module.exports = {
    init,
    constants,
};
