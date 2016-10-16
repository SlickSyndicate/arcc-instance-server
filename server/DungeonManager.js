// const Generators = require('./generators');
// let Dungeon = require("./Dungeon");
// let dungeonsRunning = {};
//
// module.exports = {
//     loadDungeon: (lat, long) => {
//         let latLong = lat + ":" + long;
//
//         // No dungeon running for these coordinates, must create a new one
//         if (!dungeonsRunning[latLong]) {
//             dungeonsRunning[latLong] = new Dungeon(fetchTerrain(lat, long));
//         }
//
//         return dungeonsRunning[latLong];
//     }
// };
//
// fetchTerrain = (lat, long) => {
//     let latLong = lat + ":" + long;
//     //TODO query rethink here
//     return Generators.outdoor(latLong);
// };