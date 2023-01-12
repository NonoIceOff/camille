const sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");
const { brotliDecompress } = require("zlib");

let db = new sqlite3.Database(
    path.join(process.cwd(), "data/sqlite.db"),
    (err) => {
        if (err) {
            console.error(err);
        }
        console.log("Connected to database.");
    }
);

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
                        "CREATE TABLE users (user_id varchar(20), xp int, bump int, monthly_bump int, coin float, voice int, last_voice_activity int);"
                    );

                    if (
                        fs.existsSync(
                            path.join(process.cwd(), "data/infos.json")
                        )
                    ) {
                        console.log("Updating database...");
                        const infos = require("../../data/infos.json"); //require(path.join(process.cwd(),"data/infos.json"));

                        let members = [];

                        Object.keys(infos.members).forEach((id) => {
                            const value = infos.members[id];
                            members.push({
                                user_id: id,
                                xp: value.xp_total,
                                bump: value.bumpstotal,
                                monthly_bump: infos.bump[id] ?? 0,
                                coin: value.esheep,
                                voice: infos.voice.members_leaderboard[id] ?? 0,
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
            }
        );
    });
}

function getUserValue(userId, valueName) {
    return new Promise((resolve) => {
        db.get(
            `SELECT ${valueName} AS value FROM users WHERE user_id=?`,
            userId,
            (err, row) => {
                resolve(row.value);
            }
        );
    });
}

function setUserValue(userId, valueName, value) {
    db.run(`UPDATE users SET ${valueName}=? WHERE user_id=?`,value,userId);
}

module.exports = {
    update,
    getUserValue,
    setUserValue,
};
