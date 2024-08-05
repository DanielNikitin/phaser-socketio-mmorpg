import { SIZES, SPRITES } from "./Assets/Constants.js";
import { Player } from "./Assets/Player/Player.js";

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene',
      active: true
    });
    this.otherPlayers = {};
  }

  preload() {
    // map tiles
    this.load.image('Main', '/Assets/Maps/Desert1.png');

    // загрузка карты
    this.load.tilemapTiledJSON('map', 'http://localhost:3009/desert');
    console.log('Map from server loaded');

    // загрузка персонажей
    this.load.spritesheet(SPRITES.PLAYER, 'Assets/Player/Character/Nude/Nude_Move.png', {
      frameWidth: SIZES.PLAYER.WIDTH,
      frameHeight: SIZES.PLAYER.HEIGHT,
    });
    console.log('Character is loaded');
  }

  create() {
    // Socket connect
    this.socket = io('http://localhost:3009');

    // Server status
    this.socket.emit('online');  // send request

    this.socket.on('server-status', (serverStatus) => {
      if (serverStatus === 'online') {
        console.log('Server status :: online');
        this.socket.emit('playerData');
        console.log('playerData request sended');
      } else {
        console.log('Server status :: offline');
      }
    });

    // Player Data
    this.socket.on('playerData', (playerData) => {

      if (playerData.id !== 0 || playerData.x !== 0 ||
          playerData.y !== 0 || playerData.speed !== 0) {

        this.playerData = playerData;
        console.log('playerData is Received ::', this.playerData);
        this.socket.emit('playerDataReceived');  // send status

        // create player
        this.createPlayer(this.playerData);

      } else {
        console.log('playerData is empty');
        this.requestPlayerData();
      }
    })

    // Players List
    this.socket.on('playersData', (playersData) => {
      if (playersData.id !== 0) {
        this.playersData = playersData;
        //this.createOtherPlayers(playersData);
        //console.log('playersData is Received ::', this.playersData);
      }
    })

    // создаем карту
    this.createMap();

    // user input
    this.cursors = this.input.keyboard.createCursorKeys();

  }

  createMap() {
    // создаем карту
    this.map = this.make.tilemap({
      key: 'map'
    });

    // first parameter is the name of the tilemap in tiled
    var tiles = this.map.addTilesetImage('Desert1', 'Main', 16, 16, 0, 0);

    // creating the layers
    this.map.createLayer('Main', tiles, 0, 0);
    this.map.createLayer('Cactus', tiles, 0, 0);

    // don't go out of the map
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
  }

  requestPlayerData() {
    setTimeout(() => {
      this.socket.emit('playerData');
      console.log('playerData request sended again...');
    }, 3000);  // повторный запрос каждые 3с
  }

  isPlayerDataValid(playerData) {
    // Проверка, чтобы убедиться, что данные игрока не пустые
    return playerData && playerData.id && playerData.id !== 0 &&
           playerData.x !== undefined && playerData.y !== undefined &&
           playerData.speed !== undefined;
  }

  createPlayer(playerData) {
    try {
      this.player = new Player(this, playerData.x, playerData.y, playerData.speed);
  
      // Включаем физику для игрока
      this.physics.world.enable(this.player);
  
      // Устанавливаем размеры и смещение коллайдерного ящика
      this.player.body.setSize(14, 20);
  
      // Настроить столкновение с границами мира
      this.player.body.setCollideWorldBounds(true);
  
      // Обновляем камеру
      this.updateCamera();
    } catch (error) {
      console.error("Error creating player:", error);
    }
  }
  

  createOtherPlayers(playersData) {
    // Убедитесь, что otherPlayers инициализирован
    if (!this.otherPlayers) {
      this.otherPlayers = {};
    }
  
    // Обновляем существующих игроков или создаем новых
    for (const playerId in playersData) {
      const playerData = playersData[playerId];
      if (this.otherPlayers[playerId]) {
        // Обновляем позицию существующего игрока
        this.otherPlayers[playerId].setPosition(playerData.x, playerData.y);
      } else {
        // Создаем нового игрока
        const otherPlayer = new Player(this, playerData.x, playerData.y, SPRITES.PLAYER, playerData.speed);
        this.physics.world.enable(otherPlayer);
        otherPlayer.body.setSize(14, 20);
        otherPlayer.body.setCollideWorldBounds(true);
        this.otherPlayers[playerId] = otherPlayer;
      }
    }
  
    // Удаляем игроков, которые больше не присутствуют
    for (const playerId in this.otherPlayers) {
      if (!(playerId in playersData)) {
        this.otherPlayers[playerId].destroy(); // Удаляем игрока из сцены
        delete this.otherPlayers[playerId]; // Удаляем игрока из объекта
      }
    }
  }  

  updateCamera() {
    // limit camera to map
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player); // follow player
    this.cameras.main.setZoom(2.5); // Увеличение в 3 раза
    this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  update(time, delta) {
    if (this.player) {
      // Обновите состояние ввода
      this.player.inputs.up = this.cursors.up.isDown;
      this.player.inputs.down = this.cursors.down.isDown;
      this.player.inputs.left = this.cursors.left.isDown;
      this.player.inputs.right = this.cursors.right.isDown;

      this.player.update(delta);

      // Отправьте состояние ввода на сервер
      const inputs = this.player.getInputs();
      this.socket.emit('playerInputs', inputs);
    }

    if (this.otherPlayers) {
      for (const playerId in this.otherPlayers) {
        const player = this.otherPlayers[playerId];
        // Update logic for other players if needed
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 650,
  zoom: 1,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [BootScene],
};

const game = new Phaser.Game(config);
