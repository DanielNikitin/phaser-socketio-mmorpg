const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();
const PORT = 3009;

app.use(cors({ origin: "*" }));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

const players = {};

////// MAIN
async function Main() {

  // GLOBAL SOCKET HANDLER
  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    // CLIENT CONNECTED
    players[socket.id] = {
      id: socket.id,
      x: Math.floor(Math.random() * 100) + 50,
      y: Math.floor(Math.random() * 200) + 50,
    };

    socket.emit("currentPlayers", players);
    console.log('players after connect: ', players);
    socket.broadcast.emit("newPlayer", players[socket.id]);

    // when a player disconnects, remove them from our players object
    socket.on('disconnect', () => {
      console.log('user disconnected: ', socket.id);
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('playerDisconnected', socket.id); // изменено с 'disconnect' на 'playerDisconnected'
      console.log('players after disconnect: ', players);
    });

  });

////// EXPRESS STATIC 
const path = require('path');

// ACCESS TO /public
app.use(express.static(path.join(__dirname, '../public')));

// MAP DESERT
const map = require('./Maps/rust2dmap.json');

app.get('/desert', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(map);
});

// CATCH ALL OTHER ROUTES
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// HANDLE ERRORS
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

////// SERVER SETTINGS 
httpServer.listen(PORT, () => {
  console.log(`SERV :: Running on ${PORT}`);
});

}

Main();

// npm run dev