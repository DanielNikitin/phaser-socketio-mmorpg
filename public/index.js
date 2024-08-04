import { SIZES, SPRITES } from "./Assets/Constants.js";
import { Player } from "./Assets/Player/Player.js";

class BootScene extends Phaser.Scene {
  constructor() {
      super({
          key: 'BootScene',
          active: true
      });
  }

  preload() {
      // map tiles
      this.load.image('Main', '/Assets/Maps/Desert1.png');

      // загрузка карты
      this.load.tilemapTiledJSON('map', 'http://localhost:3009/desert');
      console.log('map from server loaded');

      // загрузка персонажей
      this.load.spritesheet(SPRITES.PLAYER, 'Assets/Player/Character/Nude/Nude_Move.png', {
          frameWidth: SIZES.PLAYER.WIDTH,
          frameHeight: SIZES.PLAYER.HEIGHT,
      });
  }

  create() {
      this.socket = io('http://localhost:3009');

      this.otherPlayers = this.physics.add.group();

      // create map
      this.createMap();

      this.createPlayer();

      // user input
      this.cursors = this.input.keyboard.createCursorKeys();

      // Add keydown event listener
      this.input.keyboard.on('keydown', (event) => {
        //console.log(`Key pressed: ${event.key}`);
      });
  }

  createMap() {
      // create the map
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

  createPlayer() {
    const playerInfo = {
        x: 20,
        y: 20
    };
  
    // Создаем игрока
    this.player = new Player(this, playerInfo.x, playerInfo.y, SPRITES.PLAYER);

    // Создаем контейнер и добавляем в него спрайт игрока
    this.container = this.add.container(playerInfo.x, playerInfo.y);
    this.container.add(this.player);

    // Включаем физику для игрока
    this.physics.world.enable(this.player);

    // Устанавливаем размеры и смещение коллайдерного ящика
    this.player.body.setSize(14, 20);
    
    // Настроить столкновение с границами мира
    this.player.body.setCollideWorldBounds(true);

    // Обновляем камеру
    this.updateCamera();
  }


  updateCamera() {
      // limit camera to map
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.startFollow(this.player); // follow player
      this.cameras.main.setZoom(3); // Увеличение в 2 раза
      this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  update(time, delta) {
    if (this.player) {
        this.player.update(delta);

        // Получаем состояние клавиш и выводим в консоль
        const inputs = this.player.getInputs();
        // Отправляем состояние клавиш на сервер
        this.socket.emit('inputs', inputs);
    }
}

}

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
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
