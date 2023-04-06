import fetch from 'node-fetch';
import * as mongoDB from "mongodb";
import { WORLD_MONGO_CONN_URI, WORLD_MONGO_DATABASE } from '../../config';

async function updateDB() {
    const todaysDate = new Date().toDateString()
    try {
        let response = await fetch(`https://darkan.org:8443/v1/highscores?page=1&limit=999999`);
        let hiscore = await response.json();
        let client: mongoDB.MongoClient = new mongoDB.MongoClient(WORLD_MONGO_CONN_URI);
        await client.connect();
        let db: mongoDB.Db = client.db(WORLD_MONGO_DATABASE);
        let usernameHiscore = {}
        for(let i = 0; i < hiscore.length; i++) {
            usernameHiscore[hiscore[i].displayName] = {
                totalLevel: hiscore[i].totalLevel,
                totalXp: hiscore[i].totalXp,
                xp: hiscore[i].xp
            }
        }

        await db.collection("temporal").updateOne({date: todaysDate}, {$setOnInsert: {snapshot: usernameHiscore}}, { upsert: true})
        for(let i = 0; i < hiscore.length; i++) {
            let filter = {username: hiscore[i].displayName}
            let player = await db.collection("temporalPlayer").findOne(filter)
            let playerData = {}
            if(player == null) {
                playerData = {
                    username: hiscore[i].displayName,
                    dateUpdated: todaysDate,
                }
                playerData[todaysDate] = {
                    totalLevel: hiscore[i].totalLevel,
                    totalXP: hiscore[i].totalXp,
                    xp: hiscore[i].xp,
                }
                await db.collection("temporalPlayer").insertOne(playerData)
            }
            else {
                if(player["dateUpdated"] != todaysDate) {
                    player["dateUpdated"] = todaysDate
                    player[todaysDate] = {
                        totalLevel: hiscore[i].totalLevel,
                        totalXP: hiscore[i].totalXp,
                        xp: hiscore[i].xp,
                    }
                    playerData = player
                    await db.collection("temporalPlayer").replaceOne(filter, playerData)
                }
            }
        }
        console.log("Saved hiscore at " + todaysDate)
    } catch (e) {
        console.log(e)
        console.log("Error saving hiscore at " + todaysDate)
    }
}

export function startDaemonTemporalHiscores(PORT : Number) {
    function runAtMidnight() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (hours === 0 && minutes === 0) {
            updateDB()
        }
    }
    updateDB().then(r => setInterval(runAtMidnight, 1_000*60))

}
