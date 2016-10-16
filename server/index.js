let DungeonManager = require("./DungeonManager");
const port = (process.env.PORT || 4000);
const env = process.env.NODE_ENV || 'dev';

const Express = require('express');
let app = Express();
let http = require('http').Server(app);
const io = require('socket.io')(http);

const DungeonInstance = require('./DungeonInstance');
const Dungeon = require('./models/dungeon');

const morgan = require('morgan');             // log requests to the console (express4)
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const cors = require('cors');
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cors({origin: true, credentials: true}));

let dungeonCache = {};

// Only route currently
app.post('/loaddungeon', (req, res) => {
    let dungeonData = req.body.dungeon;

    if (!dungeonCache[dungeonData.id]) {
        dungeonCache[dungeonData.id] = new DungeonInstance(dungeonData, io);
    }

    res.send({message: "OK"});
});

/*io.sockets.on('connection', function (socket) {
    console.log('Socket connected, waiting for join packet');

    //TODO migrate to namespace
    socket.on('join_dungeon', (data) => {
        let lat = data.latitude;
        let long = data.longitude;
        if (!lat || !long) {
            return console.error("Latitude or longitude not specified");
        }

        let dungeon = DungeonManager.loadDungeon(lat, long);
        socket.emit('dungeon_info', {
            terrain: dungeon.terrain,
            entities: dungeon.entities
        }, () => {
            // socket.join('dungeon_' + lat + ':' + long);
            // socket.activeDungeonRoom = 'dungeon_' + lat + ':' + long;
        });
    });
    // io.to('test room').emit('text', "Client joining room");

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });
});*/

http.listen(port, () => {
    console.log('ARCC dungeon instance server listening on port', port);
});