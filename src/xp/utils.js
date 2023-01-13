/**
 * Return a level from the total XP
 * @param {number} xp 
 * @returns {number}
 */
function xpToLevel(xp) {
    return Math.sqrt(xp/55)-0.5;
}
/**
 * Return the total XP from a level
 * @param {number} xp 
 * @returns {number}
 */
function levelToXp(level) {
    return Math.floor(Math.pow((level+0.5),2)*55);
}
/**
 * Return current level infos from the total XP
 * @param {number} xp 
 * @returns {{level:number,levelupXp:number,levelXp:number}}
 */
function xpToLevelData(xp) {
    const level = xpToLevel(xp);
    const baseLevelXp = levelToXp(Math.floor(level));
    const levelupXp = levelToXp(Math.ceil(level)) - baseLevelXp;
    const levelXp = xp-baseLevelXp;
    return {
        level:Math.floor(level),
        levelupXp:Math.floor(levelupXp),
        levelXp:Math.floor(levelXp)
    };
}

module.exports = {
    xpToLevel,
    levelToXp,
    xpToLevelData,
}