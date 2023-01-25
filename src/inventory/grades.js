const { GuildMember } = require("discord.js/src/structures/GuildMember");
const { client, options } = require("../client");
const UserItem = require("./userItem");
const constantIDs = require("../constants/ids");
const itemIds = require("./itemIds");
const { toTimeFormat } = require("../utils/date");

const gradesIds = [
    itemIds.dreamTeamPass,
    itemIds.dreamTeamPlusPass,
    itemIds.superDreamTeamPass,
];

/**
 *
 * @param {any[]} usersItems
 */
async function initExpirations(usersItems) {
    const guild = await client.guilds.cache
        .get(constantIDs.workingGuild[+options.test])
        .fetch();
    const members = await guild.members.fetch();
    Object.values(usersItems).forEach(async (userItems) => {
        let grade = userItems[gradesIds[0]];

        if (userItems[gradesIds[1]])
            if (userItems[gradesIds[1]].quantity > 0)
                grade = userItems[gradesIds[1]];

        if (userItems[gradesIds[2]])
            if (userItems[gradesIds[2]].quantity > 0)
                grade = userItems[gradesIds[2]];

        if (grade.quantity <= 0) return;

        const member = await members.get(grade.user_id)?.fetch();
        if (member)
            initExpireTimeout(await member.user.getItem(grade.item), member);
    });
}

/**
 *
 * @param {UserItem} item
 */
async function initGrade(item) {
    /** @type {UserItem[]} */
    const grades = [
        await item.user.getItem(gradesIds[0]),
        await item.user.getItem(gradesIds[1]),
        await item.user.getItem(gradesIds[2]),
    ];

    let currentGrade = grades[gradesIds[0]];
    if (grades[gradesIds[1]])
        if (grades[gradesIds[1]].quantity > 0)
            currentGrade = grades[gradesIds[1]];
    if (grades[gradesIds[2]])
        if (grades[gradesIds[2]].quantity > 0)
            currentGrade = grades[gradesIds[2]];

    if (currentGrade.itemId != item.itemId) return;

    const guild = client.guilds.cache.get(
        constantIDs.workingGuild[+options.test]
    );
    const member = guild.members.cache.get(currentGrade.user.id);
    if (member) {
        currentGrade.expireDate = Date.now() + 1000 * 60 * 60 * 24 * 30;
        initExpireTimeout(currentGrade, member);
    }
}

/**
 *
 * @param {UserItem} item
 * @param {GuildMember} member
 */
async function initExpireTimeout(item, member) {
    await item.fetch();
    const diff = item.expireDate - Date.now();
    giveRoles(item, member);
    if (diff > 0x7fffffff)
        setTimeout(() => {
            initExpireTimeout(item, member);
        }, 0x7fffffff);
    else
        setTimeout(() => {
            gradeExpired(item, member);
        }, item.expireDate - Date.now());
}

/**
 *
 * @param {UserItem} item
 * @param {GuildMember} member
 */
async function gradeExpired(item, member) {
    /** @type {UserItem[]} */
    const grades = [
        await member.user.getItem(gradesIds[0]),
        await member.user.getItem(gradesIds[1]),
        await member.user.getItem(gradesIds[2]),
    ];

    let currentGrade = grades[gradesIds[0]];
    if (grades[gradesIds[1]])
        if (grades[gradesIds[1]].quantity > 0)
            currentGrade = grades[gradesIds[1]];
    if (grades[gradesIds[2]])
        if (grades[gradesIds[2]].quantity > 0)
            currentGrade = grades[gradesIds[2]];

    if (currentGrade.itemId != item.itemId) return;

    grades.forEach((grade) => {
        if (grade.expireDate) grade.expireDate += 1000 * 60 * 60 * 24 * 30;
    });

    currentGrade.quantity--;

    let newGrade = grades[gradesIds[0]];
    if (grades[gradesIds[1]])
        if (grades[gradesIds[1]].quantity > 0) newGrade = grades[gradesIds[1]];
    if (grades[gradesIds[2]])
        if (grades[gradesIds[2]].quantity > 0) newGrade = grades[gradesIds[2]];

    if (currentGrade.quantity === 0) {
        if (!newGrade.expireDate) newGrade.expireDate = currentGrade.expireDate;
        currentGrade.expireDate = null;
    }

    if (newGrade.quantity > 0) initExpireTimeout(newGrade, member);
}

/**
 *
 * @param {UserItem} grade
 * @param {GuildMember} member
 */
async function giveRoles(grade, member) {
    const guild = member.guild;
    const gradesRoles = [
        await guild.roles.cache.get(constantIDs.roles.dreamTeam[+options.test]),
        await guild.roles.cache.get(
            constantIDs.roles.dreamTeamPlus[+options.test]
        ),
        await guild.roles.cache.get(
            constantIDs.roles.superDreamTeam[+options.test]
        ),
    ];

    if (gradesIds.indexOf(grade.itemId) >= 2)
        await member.roles.add(gradesRoles[2]);
    else await member.roles.remove(gradesRoles[2]);

    if (gradesIds.indexOf(grade.itemId) >= 1)
        await member.roles.add(gradesRoles[1]);
    else await member.roles.remove(gradesRoles[1]);

    if (gradesIds.indexOf(grade.itemId) >= 0)
        await member.roles.add(gradesRoles[0]);
    else await member.roles.remove(gradesRoles[0]);
}

module.exports = { initExpirations, initGrade };
