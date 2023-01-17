const {
    Message,
    VoiceChannel,
    time,
    ReactionUserManager,
} = require("discord.js");
const { GuildMember } = require("discord.js/src/structures/GuildMember");
const VoiceState = require("discord.js/src/structures/VoiceState");

const { options } = require("../client");
const constantIDs = require("../constants/ids");
const xp = require("../constants/xp");

/**
 * Detect if `message` is eligible to give XP to the user and give it.
 * @param {Message} [message] Message
 * @example
 * fromMessage(message)
 */
function fromMessage(message) {
    if (
        !message.author.bot &&
        message.channelId != constantIDs.channels.bot[+options.test] &&
        message.channel.guildId === constantIDs.workingGuild[+options.test]
    ) {
        var xpGain =
            xp.messageMinGain +
            Math.floor(
                Math.random() * (xp.messageMaxGain - xp.messageMinGain)
            ) +
            1;
        message.author.addXP(xpGain);
    }
}

/**
 * Give XP to everyone that is no longer eligible to get XP from voice.
 * @param {VoiceState} [oldVoiceState] Old voice state of the user
 * @param {VoiceState} [newVoiceState] New voice state of the user
 */
function fromVoice(oldVoiceState, newVoiceState) {
    if (newVoiceState.guild.id === constantIDs.workingGuild[+options.test]) {
        let eligibleCount = 0;
        let memberJoined =
            !isVoiceEligible(oldVoiceState) && isVoiceEligible(newVoiceState);
        let memberLeft =
            isVoiceEligible(oldVoiceState) && !isVoiceEligible(newVoiceState);
        /**
         * @type {VoiceChannel}
         */
        let channel = newVoiceState.channel;
        if (!channel) {
            channel = oldVoiceState.channel;
        }
        if (!channel) return;

        channel.members.forEach((member) => {
            if (
                isVoiceEligible(
                    member.id === newVoiceState.id ? newVoiceState : member
                )
            )
                eligibleCount++;
        });
        if (memberLeft) eligibleCount++;

        if (eligibleCount >= 2) {
            const eventDate = Math.floor(Date.now() / 1000);

            channel.members.forEach(async (member) => {
                let lastVoiceActivity =
                    await member.user.getLastVoiceActivity();
                if (eligibleCount === 2 && memberJoined) lastVoiceActivity = 0;

                if (memberLeft && newVoiceState.id === member.id)
                    member.user.setLastVoiceActivity(0);

                if (
                    !(
                        memberLeft &&
                        isVoiceEligible(oldVoiceState) &&
                        oldVoiceState.id === member.id
                    ) &&
                    !isVoiceEligible(member)
                )
                    return;

                const timeSinceLastActivity = eventDate - lastVoiceActivity;

                if (!(memberLeft && newVoiceState.id === member.id)) {
                    if (eligibleCount === 2 && memberLeft)
                        member.user.setLastVoiceActivity(0);
                    else if (timeSinceLastActivity >= 60)
                        member.user.setLastVoiceActivity(eventDate);
                }

                if (memberJoined && newVoiceState.id === member.id) return;

                if (timeSinceLastActivity < 60 || lastVoiceActivity === 0)
                    return;

                const xpGain = Math.floor(
                    ((xp.voiceBaseGain +
                        (eligibleCount - memberJoined) * xp.voiceMembersBonus) *
                        timeSinceLastActivity) /
                        60
                );
                member.user.addVoice(timeSinceLastActivity * 1000);
                member.user.addXP(xpGain);
            });
        }
    }
}

/**
 * Detect if a member is eligible to gain XP for voice chat
 * @param {GuildMember} [member]
 */
function isVoiceEligible(member) {
    if (member.voice) {
        if (!member.voice.channel) return false;
    } else {
        if (!member.channel) return false;
    }

    if (member.mute || member.deaf) return false;
    if (member.bot) return false;
    if (member.member) if (member.member.bot) return false;

    return true;
}

module.exports = {
    fromMessage,
    fromVoice,
};
