const { GuildMember, ChatInputCommandInteraction } = require("discord.js");
const { constants } = require("./clientConstants");

const levels = {
    member: 0,
    dreamTeam: 1,
    dreamTeamPlus: 2,
    superDreamTeam: 3,
    admin: 4,
};

/**
 *
 * @param {GuildMember} member
 * @param {number} requiredLevel
 */
function hasPermission(member, requiredLevel) {
    var level = 0;

    const levelRoles = [
        constants.roles.member.id,
        constants.roles.dreamTeam.id,
        constants.roles.dreamTeamPlus.id,
        constants.roles.superDreamTeam.id,
        constants.roles.admin.id,
    ];

    member.roles.cache.forEach((_, roleId) => {
        level = Math.max(level, levelRoles.indexOf(roleId));
    });

    return level >= requiredLevel;
}

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {number} requiredLevel
 */
function canCommandRun(interaction, requiredLevel) {
    if (hasPermission(interaction.member, requiredLevel)) return true;
    var levelRoles = [
        constants.roles.member,
        constants.roles.dreamTeam,
        constants.roles.dreamTeamPlus,
        constants.roles.superDreamTeam,
        constants.roles.admin,
    ];
    interaction.reply({
        content: `Vous n'avez pas le rôle **${levelRoles[requiredLevel]}** pour executer cette commande.`,
        ephemeral: true,
    });
    return false;
}

module.exports = {
    levels,
    hasPermission,
    canCommandRun,
};
