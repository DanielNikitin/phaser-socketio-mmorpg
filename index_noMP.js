import { SIZES, SPRITES } from "./Assets/constants";

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

      // create player animations
      this.createAnimations();

      // user input
      this.cursors = this.input.keyboard.createCursorKeys();
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
  
    this.player = this.add.sprite(playerInfo.x, playerInfo.y, 'player', 0);

    // Создаем контейнер и добавляем в него спрайт игрока
    this.container = this.add.container(playerInfo.x, playerInfo.y);

    // Устанавливаем размер коллизии контейнера
    this.container.setSize(14, 20);

    // Включаем физику для контейнера
    this.physics.world.enable(this.container);

    // Обновляем камеру
    this.updateCamera();

    // Настроить столкновение с границами мира
    this.container.body.setCollideWorldBounds(true);
}


  createAnimations() {
      this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('player', {
              frames: [25, 26, 27, 28]
          }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('player', {
              frames: [9, 10, 11, 12]
          }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: 'up',
          frames: this.anims.generateFrameNumbers('player', {
              frames: [17, 18, 19, 20]
          }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: 'down',
          frames: this.anims.generateFrameNumbers('player', {
              frames: [0, 1, 2, 3]
          }),
          frameRate: 10,
          repeat: -1
      });
  }

  updateCamera() {
      // limit camera to map
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.startFollow(this.container); // follow player
      this.cameras.main.setZoom(2); // Увеличение в 2 раза
      this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  update() {

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
