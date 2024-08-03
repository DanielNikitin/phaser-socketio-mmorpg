create() {
    this.socket = io();
    // create map
    this.createMap();
    // create player animations
    this.createAnimations();
    // user input
    this.cursors = this.input.keyboard.createCursorKeys();
    // create enemies
    this.createEnemies();
    // listen for web socket events
    this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
    if (players[id].playerId === this.socket.id) {
    this.createPlayer(players[id]);
    } else {
    this.addOtherPlayers(players[id]);
    }
    }.bind(this));
    }.bind(this));
    this.socket.on('newPlayer', function (playerInfo) {
    this.addOtherPlayers(playerInfo);
    }.bind(this));
    }
    create() { this.socket = io(); // create map this.createMap(); // create player animations this.createAnimations(); // user input this.cursors = this.input.keyboard.createCursorKeys(); // create enemies this.createEnemies(); // listen for web socket events this.socket.on('currentPlayers', function (players) { Object.keys(players).forEach(function (id) { if (players[id].playerId === this.socket.id) { this.createPlayer(players[id]); } else { this.addOtherPlayers(players[id]); } }.bind(this)); }.bind(this)); this.socket.on('newPlayer', function (playerInfo) { this.addOtherPlayers(playerInfo); }.bind(this)); }
    create() {
      this.socket = io();
    
      // create map
      this.createMap();
    
      // create player animations
      this.createAnimations();
    
      // user input
      this.cursors = this.input.keyboard.createCursorKeys();
    
      // create enemies
      this.createEnemies();
    
      // listen for web socket events
      this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
          if (players[id].playerId === this.socket.id) {
            this.createPlayer(players[id]);
          } else {
            this.addOtherPlayers(players[id]);
          }
        }.bind(this));
      }.bind(this));
    
      this.socket.on('newPlayer', function (playerInfo) {
        this.addOtherPlayers(playerInfo);
      }.bind(this));
    }
    In the code above, we did the following:
    
    First, we removed the `this.updateCamera();` line. We will be moving this to the createPlayer function.
    We then added event listeners for the currentPlayers and newPlayer web socket messages.
    In the function that is triggered when the currentPlayers event is received, we create an array of all the keys in the players object and loop through them. We then check to see if that object’s playerId matches the socket id of the currently connected player.
    If the id matches, then we call the createPlayer function and pass that function the player object.
    If the id does not match, then we call a new function called addOtherPlayers and pass that function the player object.
    In the function that is triggered when the newPlayer event is received, we call the addOtherPlayers function and pass that function the playerInfo object.
    Next, replace the logic for the createPlayer function inside the WorldScene class with the following code:
    
    Plain text
    Copy to clipboard
    Open code in new window
    EnlighterJS 3 Syntax Highlighter
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
    }
    createPlayer(playerInfo) { // our player sprite created through the physics system this.player = this.add.sprite(0, 0, 'player', 6); this.container = this.add.container(playerInfo.x, playerInfo.y); this.container.setSize(16, 16); this.physics.world.enable(this.container); this.container.add(this.player); // update camera this.updateCamera(); // don't go out of the map this.container.body.setCollideWorldBounds(true); }
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
    }