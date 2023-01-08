const { Client, GatewayIntentBits, Partials } = require("discord.js");

const config = require("../config");

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

/**
* Options of the bot
* @type {ClientOptions}
*/
let options;

/**
 * Options used for the bot
 * @typedef {Object} ClientOptions
 * @property {Boolean} [test] Define if the bot have to run in test mode
 * @property {Boolean} [resetCommands] Define if the commands have to be redefined
 */
/**
 * Initialize the bot client
 * @param {ClientOptions} [botOptions] Options of the bot
 * @returns {void}
 * @example
 * client.init({test:true,resetCommands:false})
 */
async function init(botOptions) {
    if (botOptions) options = botOptions;
    if (options.test) {
        await client.login(config.testToken);
    } else {
        await client.login(config.token);
    }
}

module.exports = {
    client,
    options,
    init
}