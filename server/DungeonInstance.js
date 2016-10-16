const Crypto = require('crypto');

function Dungeon(dungeonData, io) {
    this.players = [];
    this.entities = {};
    this.terrain = dungeonData.terrain;
    this.namespace = io.of('/' + dungeonData.id);
    console.log("Socket.io namespace is /" + dungeonData.id);

    this.namespace.on('connection', (socket) => {
        this.addPlayer(socket);
    });
}

Dungeon.prototype.addPlayer = function (socket) {
    Crypto.randomBytes(16, (error, buf) => {
        if (error) return console.error(error);

        let player = {
            id: buf.toString('hex'),
            x: 0,
            y: 0,
            character: Math.floor(Math.random() * (10 + 1))
        };
        this.players.push(player);
        this.entities[player.id] = player;
        socket.player = player;
        this.handleConnection(socket);
    });
};

Dungeon.prototype.handleConnection = function (socket) {
    this.namespace.emit('entity_create', socket.player);

    socket.on("dungeon_join", () => {
        socket.emit("dungeon_info", {
            terrain: this.terrain,
            entities: this.entities,
            playerId: socket.player.id
        });
    });

    socket.on('player_move', (data) => {
        let player = socket.player;
        let velocityX = 0;
        let velocityY = 0;
        let magnitude = 500;
        if (data.sprinting) magnitude *= 1.5;
        if (data.directions[0]) velocityY -= magnitude;
        if (data.directions[1]) velocityY += magnitude;
        if (data.directions[2]) velocityX -= magnitude;
        if (data.directions[3]) velocityX += magnitude;

        player.x += velocityX / 25;
        player.y += velocityY / 25;

        this.namespace.emit('entity_move', {id: player.id, velocityX: velocityX, velocityY: velocityY});
    });

    socket.on('player_sync', (data) => {
        socket.broadcast.emit('entity_sync', {id: data.id, x: data.x, y: data.y});
    });

    socket.on('player_fire', (data) => {
        this.namespace.emit('bullet_create', data);
    });

    socket.on('disconnect', () => {
        console.log("Player", socket.player.id, "disconnected");
        delete this.entities[socket.player.id];
        this.namespace.emit('entity_destroy', socket.player);
    });
};

module.exports = Dungeon;