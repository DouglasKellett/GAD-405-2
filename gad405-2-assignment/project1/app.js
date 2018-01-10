const mainState = {
  addPipe: function () {
    const pipeHolePosition = game.rnd.between(70 , 330 - this.pipeHole);

    const lowerPipe = this.pipes.create(600, pipeHolePosition + this.pipeHole, 'pipe');
    game.physics.arcade.enable(lowerPipe);
    lowerPipe.body.velocity.x = -this.birdSpeed;
    lowerPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    this.birdJustCrossedPipes = false;
  },

  addFloor: function () {
    const floorSpawn = game.add.sprite(400, 420, 'floor');
    game.physics.enable(floorSpawn, Phaser.Physics.ARCADE);
    //floor.body.immovable = true;
    floorSpawn.body.velocity.x = -this.birdSpeed;
  },

  create: function () {
    game.add.tileSprite(0, 0, 470, 470, 'background');
    // read about the next line at https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#disableVisibilityChange
    game.stage.disableVisibilityChange = true;

    this.bird = game.add.sprite(80, 240, 'bird');
    this.bird.anchor.set(-1);
    this.birdSpeed = 250;
    this.birdFlapPower = 500;
    this.birdJustCrossedPipes = false;
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 800;
    this.bird.body.collideWorldBounds = true;

    this.cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


    this.flapSound = game.add.audio('flap');

    this.ground = this.floorSpawn

    this.pipes = game.add.group();
    this.pipeHole = 200;
    this.addPipe();

    this.score = 0;
    this.scoreText = game.add.text(230, 20, '0', { font: '30px Arial', fill: '#ffffff' });

    //game.SPACEBAR.onDown.add(this.flap, this);
    game.time.events.loop(2000, this.addPipe, this);
    game.time.events.loop(2000, this.addFloor, this);

    sprite1 = game.add.sprite(0, 420, 'floor');
    sprite1.name = 'floor';
    game.physics.enable(sprite1, Phaser.Physics.ARCADE);
    sprite1.body.immovable = true;
    sprite1.body.velocity.x = -this.birdSpeed;
  },

  die: function () {
    game.state.start('main');
  },

  flap: function () {
    if (this.bird.y > 350){
      this.flapSound.play();
      this.bird.body.velocity.y = -this.birdFlapPower;
    }
  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe1.png');
    game.load.audio('flap', 'assets/jump.mp3');
    game.load.image('floor', 'assets/floor1.png');
    game.load.image('background', 'assets/background1.png');
  },

  update: function () {
    if (game.physics.arcade.overlap(this.bird, this.pipes)){
      this.die();
    }
    if (this.bird.y > game.height) {
      this.die();
    }

    game.physics.arcade.collide(sprite1, this.bird);
    game.physics.arcade.collide(this.ground, this.bird);

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.flap();
    }

    this.pipes.forEach((pipe) => {
      if (this.birdJustCrossedPipes === false && pipe.alive && pipe.x + pipe.width < this.bird.x) {
        this.birdJustCrossedPipes = true;
        this.updateScore();
      }
    });
  },

  updateScore: function () {
    this.score = this.score + 1;
    this.scoreText.text = `${this.score}`;
  }
};

const game = new Phaser.Game(470, 470);
game.state.add('main', mainState);
game.state.start('main');
