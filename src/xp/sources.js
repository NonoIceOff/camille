const { Message } = require("discord.js");
const VoiceState = require("discord.js/src/structures/VoiceState");

const { options } = require("../client");
const constantIDs = require("../constants/ids");

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
        var xpGain = 5 + Math.floor(Math.random() * 5) + 1;
        message.author.addXP(xpGain);
    }
}

/**
 * Give XP to everyone that is no longer eligible to get XP from voice.
 * @param {VoiceState} [oldVoiceState] Old voice state of the channel
 * @param {VoiceState} [newVoiceState] New voice state of the channel
 */
function fromVoice(oldVoiceState, newVoiceState) {
    // TODO: Rewrite with DB
    if (false) {
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
    }
}

module.exports = {
    fromMessage,
    fromVoice,
};
