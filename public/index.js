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
        this.load.spritesheet('player', 'Assets/Player/2skins.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        // Enemies
        this.load.image('golem', 'Assets/Enemies/coppergolem.png');
        this.load.image('ent', 'Assets/Enemies/dark-ent.png');
        this.load.image('demon', 'Assets/Enemies/demon.png');
        this.load.image('worm', 'Assets/Enemies/giant-worm.png');
        this.load.image('wolf', 'Assets/Enemies/wolf.png');

        // Items
        this.load.image('sword', 'Assets/Player/Items/attack-icon.png');
    }

    create() {
        this.socket = io('http://localhost:3009');

        this.otherPlayers = this.physics.add.group();

        // create map
        this.createMap();

        // create player animations
        this.createAnimations();

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        // create enemies
        this.createEnemies();

        // Обработка событий WebSocket
        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                if (players[id].id === this.socket.id) {
                    this.createPlayer(players[id]);
                } else {
                    this.addOtherPlayers(players[id]);
                }
            });
        });

        this.socket.on('newPlayer', (playerInfo) => {
            this.addOtherPlayers(playerInfo);
        });

        this.socket.on('playerDisconnected', (playerId) => {
            console.log('Received playerDisconnected event for playerId:', playerId);
            this.otherPlayers.getChildren().forEach((player) => {
                if (playerId === player.playerId) {
                    player.destroy();
                    console.log('Player disconnected and removed from map:', playerId);
                }
            });
        });
        
    };

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

    createPlayer(playerInfo) {
        // our player sprite created through the physics system
        this.player = this.add.sprite(0, 0, 'player', 6);
        this.container = this.add.container(playerInfo.x, playerInfo.y);
        this.container.setSize(16, 16);
        this.physics.world.enable(this.container);
        this.container.add(this.player);
        // update camera
        this.updateCamera();
        // don't go out of the map
        this.container.body.setCollideWorldBounds(true);
        // collision from player to enemy
        this.physics.add.collider(this.container, this.spawns);
      }

    addOtherPlayers(playerInfo) {
      const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'player', 9);
      otherPlayer.setTint(Math.random() * 0xffffff);
      otherPlayer.playerId = playerInfo.id;  // присвоить id к подключенному
      this.otherPlayers.add(otherPlayer);
    }

    createAnimations() {
      //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {
          frames: [1, 7, 1, 13]
        }),
        frameRate: 10,
        repeat: -1
      });

      // animation with key 'right'
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {
          frames: [1, 7, 1, 13]
        }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', {
          frames: [2, 8, 2, 14]
        }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', {
          frames: [0, 6, 0, 12]
        }),
        frameRate: 10,
        repeat: -1
      });
    }

    createEnemies() {
        // where the enemies will be
        this.spawns = this.physics.add.group({
          classType: Phaser.GameObjects.Sprite
        });
        for (var i = 0; i < 20; i++) {
          const location = this.getValidLocation();
          // parameters are x, y, width, height
          var enemy = this.spawns.create(location.x, location.y, this.getEnemySprite());
          enemy.body.setCollideWorldBounds(true);
          enemy.body.setImmovable();
        }
      }
    
    getEnemySprite() {
      var sprites = ['golem', 'ent', 'demon', 'worm', 'wolf'];
      return sprites[Math.floor(Math.random() * sprites.length)];
    }

    getValidLocation() {
      var validLocation = false;
      var x, y;
      while (!validLocation) {
        x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        var occupied = false;
        this.spawns.getChildren().forEach((child) => {
          if (child.getBounds().contains(x, y)) {
            occupied = true;
          }
        });
        if (!occupied) validLocation = true;
      }
      return { x, y };
    }

    onMeetEnemy(player, zone) {
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      }

    updateCamera() {
        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.container); // follow player
        this.cameras.main.roundPixels = true; // avoid tile bleed
      }

    update() {
      if (this.container) {
        this.container.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
          this.container.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
          this.container.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
          this.container.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
          this.container.body.setVelocityY(80);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
          this.player.anims.play('left', true);
          this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
          this.player.anims.play('right', true);
          this.player.flipX = false;
        } else if (this.cursors.up.isDown) {
          this.player.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
          this.player.anims.play('down', true);
        } else {
          this.player.anims.stop();
        }
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
    scene: [BootScene]
};

const game = new Phaser.Game(config);
