/**
 * Return a level from the total XP
 * @param {number} xp 
 * @returns {number}
 */
function xpToLevel(xp,exact = false) {
    if (exact) return Math.sqrt(xp/55)-0.5;
    else return Math.max(0,Math.floor(xpToLevel(xp,true)));
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
    const level = xpToLevel(xp,true);
    const baseLevelXp = levelToXp(Math.max(-0.5,Math.floor(level)));
    const levelupXp = levelToXp(Math.max(1,Math.ceil(level))) - baseLevelXp;
    const levelXp = xp-baseLevelXp;
    return {
        level:Math.max(0,Math.floor(level)),
        levelupXp:Math.floor(levelupXp),
        levelXp:Math.floor(levelXp)
    };
}

module.exports = {
    xpToLevel,
    levelToXp,
    xpToLevelData,
}