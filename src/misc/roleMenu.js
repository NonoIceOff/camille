const { MessageReaction, User, Role } = require("discord.js");
const { GuildMember } = require("discord.js/src/structures/GuildMember");
const { client, options } = require("../client");
const constantIDs = require("../constants/ids");

/**
 * Add the reacted role on the role menu to the user
 * @param {MessageReaction} [reaction] Reaction
 * @param {User} [user] User that reacted to the role menu
 * @example
 * addRole(reaction, user)
 */
function addRole(reaction, user) {
    if (
        reaction.message.id ==
        constantIDs.messages.notifsRoleMenu[+options.test]
    ) {
        const reactionRoles = {
            "📊": constantIDs.roles.notifPoll[+options.test],
            "🔴": constantIDs.roles.notifVideo[+options.test],
            "🏆": constantIDs.roles.notifEvent[+options.test],
            "🍺": constantIDs.roles.notifShorts[+options.test],
        };

        /**
         * @type {Role}
         */
        var role = null;
        if (reactionRoles[reaction.emoji.name]) {
            role = client.guilds.cache
                .get(constantIDs.workingGuild[+options.test])
                .roles.cache.get(reactionRoles[reaction.emoji.name]);

            if (role != null) {
                const member = client.guilds.cache
                    .get(constantIDs.workingGuild[+options.test])
                    .members.cache.get(user.id);

                member.roles.add(role).catch(console.error);
            }
        }
    }
}

/**
 * Remove the reacted role on the role menu to the user
 * @param {MessageReaction} [reaction] Reaction
 * @param {User} [user] User that reacted to the role menu
 * @example
 * removeRole(reaction, user)
 */
function removeRole(reaction, user) {
    if (
        reaction.message.id ==
        constantIDs.messages.notifsRoleMenu[+options.test]
    ) {
        const reactionRoles = {
            "📊": constantIDs.roles.notifPoll[+options.test],
            "🔴": constantIDs.roles.notifVideo[+options.test],
            "🏆": constantIDs.roles.notifEvent[+options.test],
            "🍺": constantIDs.roles.notifShorts[+options.test],
        };

        /**
         * @type {Role}
         */
        var role = null;

        if (reactionRoles[reaction.emoji.name]) {
            role = client.guilds.cache
                .get(constantIDs.workingGuild[+options.test])
                .roles.cache.get(reactionRoles[reaction.emoji.name]);

            if (role != null) {
                /**
                 * @type {GuildMember}
                 */
                const member = client.guilds.cache
                    .get(constantIDs.workingGuild[+options.test])
                    .members.cache.get(user.id);

                member.roles.remove(role).catch(console.error);
            }
        }
    }
}

module.exports = {
    addRole,
    removeRole,
};
