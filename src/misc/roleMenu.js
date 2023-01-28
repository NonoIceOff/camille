const { MessageReaction, User, Role, GuildMember } = require("discord.js");
const { client, options } = require("../client");
const constantIDs = require("../constants/ids");
const { constants } = require("../utils/clientConstants");

/**
 * Add the reacted role on the role menu to the user
 * @param {MessageReaction} [reaction] Reaction
 * @param {User} [user] User that reacted to the role menu
 */
function addRole(reaction, user) {
    if (
        reaction.message.id ==
        constantIDs.messages.notifsRoleMenu[+options.test]
    ) {
        const reactionRoles = {
            "📊": constants.roles.notifPoll,
            "🔴": constants.roles.notifVideo,
            "🏆": constants.roles.notifEvent,
            "🍺": constants.roles.notifShorts,
        };

        /**
         * @type {Role}
         */
        var role = null;
        if (reactionRoles[reaction.emoji.name]) {
            role = reactionRoles[reaction.emoji.name];

            if (role != null) {
                const member = constants.workingGuild.members.cache.get(
                    user.id
                );

                member.roles.add(role).catch(console.error);
            }
        }
    }
}

/**
 * Remove the reacted role on the role menu to the user
 * @param {MessageReaction} [reaction] Reaction
 * @param {User} [user] User that reacted to the role menu
 */
function removeRole(reaction, user) {
    if (
        reaction.message.id ==
        constantIDs.messages.notifsRoleMenu[+options.test]
    ) {
        const reactionRoles = {
            "📊": constants.roles.notifPoll,
            "🔴": constants.roles.notifVideo,
            "🏆": constants.roles.notifEvent,
            "🍺": constants.roles.notifShorts,
        };

        /**
         * @type {Role}
         */
        var role = null;
        if (reactionRoles[reaction.emoji.name]) {
            role = reactionRoles[reaction.emoji.name];

            if (role != null) {
                const member = constants.workingGuild.members.cache.get(
                    user.id
                );

                member.roles.remove(role).catch(console.error);
            }
        }
    }
}

module.exports = {
    addRole,
    removeRole,
};
