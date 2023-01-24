const sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");
const { brotliDecompress } = require("zlib");
const { client } = require("../client");

let db = new sqlite3.Database(
    path.join(process.cwd(), "data/sqlite.db"),
    (err) => {
        if (err) {
            console.error(err);
        }
        console.log("Connected to database.");
    }
);

/**
 * Checks if the database needs to be updated and take action if necessary
 */
function update() {
    db.serialize(() => {
        db.all(
            "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';",
            (err, rows) => {
                let tables = rows.map((row) => row.name);

                if (tables.includes("users")) {
                    //TODO: Check if all columns are correct
                } else {
                    console.log('Creating "users" table in database...');
                    db.exec(
                        "CREATE TABLE users (user_id varchar(20), xp int, bump int, monthly_bump int, coin float, voice int, last_voice_activity bigint);"
                    );

                    if (
                        fs.existsSync(
                            path.join(process.cwd(), "data/infos.json")
                        )
                    ) {
                        console.log("Updating database...");
                        const infos = require("../../data/infos.json");

                        let members = [];

                        Object.keys(infos.members).forEach((id) => {
                            const value = infos.members[id];
                            members.push({
                                user_id: id,
                                xp: value.xp_total,
                                bump: value.bumpstotal,
                                monthly_bump: infos.bump[id] ?? 0,
                                coin: value.esheep,
                                voice:
                                    new Date(0).setSeconds(
                                        infos.voice.members_leaderboard[id]
                                    ) ?? 0,
                                last_voice_activity: 0,
                            });
                        });

                        db.run(
                            `INSERT INTO users (user_id,xp,bump,monthly_bump,coin,voice,last_voice_activity) VALUES ${members
                                .map(() => "(?,?,?,?,?,?,?)")
                                .join(",")}`,
                            members
                                .map((member) => [
                                    member.user_id,
                                    member.xp,
                                    member.bump,
                                    member.monthly_bump,
                                    member.coin,
                                    member.voice,
                                    member.last_voice_activity,
                                ])
                                .flat()
                        );
                    }
                }
                if (tables.includes("purchases")) {
                    //TODO: Check if all columns are correct
                } else {
                    console.log('Creating "purchases" table in database...');
                    db.exec(
                        "CREATE TABLE purchases (user_id varchar(20), item int, quantity int, timestamp bigint);"
                    );
                    if (
                        fs.existsSync(
                            path.join(process.cwd(), "data/shop.json")
                        )
                    ) {
                        console.log("Updating database...");
                        const shop = require("../../data/shop.json");

                        let purchases = [];

                        Object.keys(shop.Members).forEach((id) => {
                            const value = shop.Members[id];

                            value.Grades.forEach((count, item) => {
                                purchases.push({
                                    user_id: id,
                                    item: item,
                                    quantity: count,
                                    timestamp: Date.now(),
                                });
                            });
                        });

                        db.run(
                            `INSERT INTO purchases (user_id,item,quantity,timestamp) VALUES ${purchases
                                .map(() => "(?,?,?,?)")
                                .join(",")}`,
                            purchases
                                .map((item) => [
                                    item.user_id,
                                    item.item,
                                    item.quantity,
                                    item.timestamp,
                                ])
                                .flat()
                        );
                    }
                }
                if (tables.includes("inventory")) {
                    //TODO: Check if all columns are correct
                } else {
                    console.log('Creating "inventory" table in database...');
                    db.exec(
                        "CREATE TABLE inventory (user_id varchar(20), item int, quantity int, expire_date bigint);"
                    );
                    if (
                        fs.existsSync(
                            path.join(process.cwd(), "data/shop.json")
                        )
                    ) {
                        console.log("Updating database...");
                        const shop = require("../../data/shop.json");

                        let purchases = [];

                        Object.keys(shop.Members).forEach((id) => {
                            const value = shop.Members[id];

                            value.Grades.forEach((count, item) => {
                                purchases.push({
                                    user_id: id,
                                    item: item,
                                    quantity: count,
                                    expire_date: count ?
                                        Date.now() + 1000 * 60 * 60 * 24 * 30 -((((29*24+23)*60+59)*60+50)*1000) : null,
                                });
                            });
                        });

                        db.run(
                            `INSERT INTO inventory (user_id,item,quantity,expire_date) VALUES ${purchases
                                .map(() => "(?,?,?,?)")
                                .join(",")}`,
                            purchases
                                .map((item) => [
                                    item.user_id,
                                    item.item,
                                    item.quantity,
                                    item.expire_date,
                                ])
                                .flat()
                        );
                    }
                }
            }
        );
    });
}

/**
 * Register a new user in the database
 * @param {string} userId User ID
 * @param {() =>  void} callback Callback when the user is created.
 */
function registerUser(userId, callback) {
    db.run(
        `INSERT INTO users (user_id,xp,bump,monthly_bump,coin,voice,last_voice_activity) VALUES (?,0,0,0,0,0,0)`,
        [userId],
        (err) => {
            if (err) {
                console.error(err);
            } else {
                callback();
            }
        }
    );
}

/**
 * Get a user value from the database
 * @param {string} userId User ID
 * @param {string} valueName Name of the value to get. Look at `data/userValuesName` to get the list of values.
 */
function getUserValue(userId, valueName) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT ${valueName} AS value FROM users WHERE user_id=?`,
            userId,
            (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row) {
                    registerUser(userId, async () => {
                        resolve(await getUserValue(userId, valueName));
                    });
                } else {
                    resolve(row.value);
                }
            }
        );
    });
}

/**
 * Set a user value in the database
 * @param {string} userId User ID
 * @param {string} valueName Name of the value to set. Look at `data/userValuesName` to get the list of values.
 * @param {any} value Value to set.
 */
function setUserValue(userId, valueName, value) {
    db.run(
        `UPDATE users SET ${valueName}=? WHERE user_id=?`,
        [value, userId],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}

/**
 * Add `value` to user value in the database
 * @param {string} userId User ID
 * @param {string} valueName Name of the value to set. Look at `data/userValuesName` to get the list of values.
 * @param {any} value Value to add.
 */
function addUserValue(userId, valueName, value) {
    db.run(
        `UPDATE users SET ${valueName}=${valueName}+? WHERE user_id=?`,
        [value, userId],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}

/**
 * Get top users in a given value from the database
 * @param {string} userId User ID
 * @param {string} valueName Name of the value to order by. Look at `data/userValuesName` to get the list of values.
 * @returns {Promise<{userId:string,value:any}[]>}
 */
function getTopUserValue(valueName, skip, count) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT user_id AS userId, ${valueName} AS value FROM users ORDER BY ${valueName} DESC LIMIT ${skip},${count}`,
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

/**
 * Get user count
 * @returns {Promise<number>}
 */
function getUserCount() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(ALL) AS count FROM users`, (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row.count);
        });
    });
}

/**
 * Get an item of a user.
 * @param {string} userId
 * @param {number} itemId
 * @returns
 */
function getUserItem(userId, itemId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM inventory WHERE user_id=? AND item=?`,
            [userId, itemId],
            (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            }
        );
    });
}

/**
 * Get all items of a user.
 * @param {string} userId
 * @returns {Promise<any[]>}
 */
function getUserItems(userId) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM inventory WHERE user_id=?`,
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            }
        );
    });
}

/**
 * Get an item of all users.
 * @param {number} item
 * @returns
 */
function getUsersItem(item) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM inventory WHERE item=?`, [item], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

/**
 * Get all items of all users.
 * @returns {Promise<any[]>}
 */
function getUsersItems() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM inventory`, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

/**
 * Register an item for a user
 * @param {string} userId 
 * @param {number} itemId 
 * @param {number} quantity 
 * @param {number} expireDate 
 */
function registerUserItem(userId, itemId, quantity = 0, expireDate = 0) {
    db.get(
        `INSERT INTO inventory (user_id,item,quantity,expire_date) VALUES (?,?,?,?)`,
        [userId, itemId, quantity, expireDate],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}

/**
 * Unregister an item for a user
 * @param {string} userId 
 * @param {number} itemId 
 */
function unregisterUserItem(userId, itemId) {
    db.get(
        `DETELE FROM inventory WHERE user_id=? AND item=?`,
        [userId, itemId],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}


/**
 * Set a user value in the database
 * @param {string} userId User ID
 * @param {number} itemId Item ID
 * @param {string} valueName Name of the value to set. Look at `data/inventoryValuesName` to get the list of values.
 * @param {any} value Value to set.
 */
function setUserItemValue(userId, itemId, valueName, value) {
    db.run(
        `UPDATE inventory SET ${valueName}=? WHERE user_id=? AND item=?`,
        [value, userId, itemId],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}


/**
 * Add a user value in the database
 * @param {string} userId User ID
 * @param {number} itemId Item ID
 * @param {string} valueName Name of the value to add. Look at `data/inventoryValuesName` to get the list of values.
 * @param {any} value Value to add.
 */
function addUserItemValue(userId, itemId, valueName, value) {
    db.run(
        `UPDATE inventory SET ${valueName}=${valueName}+? WHERE user_id=? AND item=?`,
        [value, userId, itemId],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}


/**
 * Register the purchase of a user
 * @param {string} userId 
 * @param {number} itemId 
 * @param {number} quantity 
 * @param {number} timestamp 
 */
function registerUserPurchase(userId, itemId, quantity, timestamp) {
    db.get(
        `INSERT INTO purchases (user_id,item,quantity,timestamp) VALUES (?,?,?,?)`,
        [userId, itemId, quantity, timestamp],
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
}



module.exports = {
    update,
    getUserValue,
    setUserValue,
    addUserValue,
    getTopUserValue,
    getUserCount,
    getUserItem,
    getUserItems,
    getUsersItem,
    getUsersItems,
    registerUserItem,
    unregisterUserItem,
    setUserItemValue,
    addUserItemValue,
    registerUserPurchase,
};
