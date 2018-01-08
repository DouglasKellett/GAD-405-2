const mainState = {

  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.add.tilemap('rpg_map');
    this.map.addTilesetImage('rpg_tileset', 'tileset');
    this.backgroundLayer = this.map.createLayer('groundlayer');
    this.collisionLayer = this.map.createLayer('collisionlayer');
    this.game.world.sendToBack(this.backgroundLayer);
    game.physics.arcade.enable(this.collisionLayer);
    this.map.setCollision(4, true, 'collisionlayer');
    this.map.setCollisionBetween(1, 160, true, 'collisionlayer');
    this.collisionLayer.resizeWorld();

    this.player = this.add.sprite(90, 450, 'player');
    game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2;

    this.player.collideWorldBounds = true;

    this.item = this.add.sprite(575, 80, 'item');
    game.physics.arcade.enable(this.item);

    this.enemy = this.add.sprite(300, 200, 'enemy');
    game.physics.arcade.enable(this.enemy);

    this.foundSound = game.add.audio('sound');

    this.cursors = game.input.keyboard.createCursorKeys();
  },

  hitEnemy: function () {
    console.log('you encounter an enemy');
    this.foundSound.play();
  },

  hitItem: function () {
    console.log('you found an item');
    this.foundSound.play();
  },

  preload: function () {
    game.load.image('player', 'assets/heroine.png');
    game.load.image('item', 'assets/item.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.tilemap('rpg_map', 'assets/rpg_tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'assets/rpg_tileset.png');
    game.load.audio('sound', 'assets/sound.mp3');
  },

  update: function () {
    // read about collide and overlap
    game.physics.arcade.collide(this.player, this.collisionLayer);
    game.physics.arcade.overlap(this.player, this.enemy, this.hitEnemy, null, this);
    game.physics.arcade.overlap(this.player, this.item, this.hitItem, null, this);

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    let step = 95;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = this.player.body.velocity.x - step;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.body.velocity.x + step;
    } else if (this.cursors.up.isDown) {
      this.player.body.velocity.y = this.player.body.velocity.y - step;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.body.velocity.y + step;
    }
  }

};

const game = new Phaser.Game(720, 630);
game.state.add('main', mainState);
game.state.start('main');
