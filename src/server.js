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

const TICK_RATE = 60;
const SPEED = 1;

const players = {};
const inputsMap = {};

function updatePlayers() {
  io.emit('playersData', players);
}

function tick() {
  for (const [id, player] of Object.entries(players)) {
      const inputs = inputsMap[id];
      
      if (inputs) {
          if (inputs.up) {
              player.y -= SPEED;
          } else if (inputs.down) {
              player.y += SPEED;
          }

          if (inputs.left) {
              player.x -= SPEED;
          } else if (inputs.right) {
              player.x += SPEED;
          }

          // Отправляем обновленные данные игрока всем клиентам
          io.emit('updatePlayer', player);
      }
  }
  updatePlayers();
}


async function Main() {
  io.on("connection", (socket) => {
    console.log("user connected ::", socket.id);

    // Отправляем статус сервера новому клиенту
    socket.emit('server-status', 'online');
    console.log('server-status sended');
    
    // Отправляем список всех игроков новому клиенту
    socket.emit('playersData', players);
    console.log('playersData is sended');

    // Добавляем нового игрока
    const playerData = {
      id: socket.id,
      speed: SPEED,
      x: Math.floor(Math.random() * 100) + 50,
      y: Math.floor(Math.random() * 200) + 50,
    };


    inputsMap[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    // массив players с данными playerData
    players[socket.id] = playerData;

    console.log(players);

    // Отправляем обновленный список всех игроков всем клиентам
    updatePlayers();

    socket.on('playerData', () => {
      console.log('playerData request is Received');
      socket.emit('playerData', playerData);
      console.log('playerData is sended');
    });

    socket.on('playerDataReceived', () => {
      console.log('playerData is Received');
      console.log('----');
    });

    socket.on('playerInputs', (cursors) => {
      console.log(cursors);
      // Обновляем состояние нажатых клавиш для этого игрока
      inputsMap[socket.id] = {
          up: cursors.up.isDown,
          down: cursors.down.isDown,
          left: cursors.left.isDown,
          right: cursors.right.isDown,
      };
      
      // Обновляем позицию игрока на сервере
      tick();
    });

    socket.on("disconnect", () => {
      console.log("user disconnected ::", socket.id);
      console.log('-----');
      
      // Удаляем игрока из списка
      delete inputsMap[socket.id];
      delete players[socket.id];
      
      // Отправляем обновленный список всех игроков всем клиентам
      updatePlayers();
      console.log('update playersData', players);
    });
  });
  


//// PATH
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../public')));

  const map = require('./Maps/rust2dmap.json');

  app.get('/desert', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(map);
  });

  app.use((req, res, next) => {
    res.status(404).json({ message: '404 - Not Found' });
  });

  app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500).json({ error: err.message });
  });

  httpServer.listen(PORT, () => {
    console.log(`SERV :: Running on ${PORT}`);
  });

  setInterval(tick, 1000 / TICK_RATE);
}

Main();
