const { User } = require("discord.js");

const { getUserValue, setUserValue, addUserValue } = require("../db");
const userValuesName = require("../userValuesName");

/**
 * Init all user basic values-related prototypes
 */
function init() {
    // XP

    User.prototype.getXP = function () {
        return getUserValue(this.id, userValuesName.XP);
    };
    User.prototype.setXP = function (xp) {
        setUserValue(this.id, userValuesName.XP, xp);
    };

    // Bump

    User.prototype.getBump = function () {
        return getUserValue(this.id, userValuesName.bump);
    };
    User.prototype.setBump = function (bump) {
        setUserValue(this.id, userValuesName.bump, bump);
    };
    User.prototype.addBump = async function (
        bump,
        dontEditMonthlyBump = false
    ) {
        addUserValue(this.id, userValuesName.bump, bump);
        if (!dontEditMonthlyBump) this.addMonthlyBump(bump);
    };

    // Monthly Bump

    User.prototype.getMonthlyBump = function () {
        return getUserValue(this.id, userValuesName.monthlyBump);
    };
    User.prototype.setMonthlyBump = function (bump) {
        setUserValue(this.id, userValuesName.monthlyBump, bump);
    };
    User.prototype.addMonthlyBump = async function (bump) {
        addUserValue(this.id, userValuesName.monthlyBump, bump);
    };

    // Coin

    User.prototype.getCoin = function () {
        return getUserValue(this.id, userValuesName.coin);
    };
    User.prototype.setCoin = function (coin) {
        setUserValue(this.id, userValuesName.coin, coin);
    };
    User.prototype.addCoin = async function (coin) {
        addUserValue(this.id, userValuesName.coin, coin);
    };

    // Voice

    User.prototype.getVoice = function () {
        return getUserValue(this.id, userValuesName.voice);
    };
    User.prototype.setVoice = function (voice) {
        setUserValue(this.id, userValuesName.voice, voice);
    };
    User.prototype.addVoice = async function (voice) {
        addUserValue(this.id, userValuesName.voice, voice);
    };

    // Last Voice Activity

    User.prototype.getLastVoiceActivity = function () {
        return getUserValue(this.id, userValuesName.lastVoiceActivity);
    };
    User.prototype.setLastVoiceActivity = function (lastVoiceActivity) {
        setUserValue(
            this.id,
            userValuesName.lastVoiceActivity,
            lastVoiceActivity
        );
    };
}

module.exports = { init };
