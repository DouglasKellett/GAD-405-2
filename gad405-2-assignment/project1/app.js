const mainState = {

  addFloor: function () {
    const floorSpawn = this.ground.create(400, 420, 'floor');
    game.physics.enable(floorSpawn, Phaser.Physics.ARCADE);
    floorSpawn.body.immovable = true;
    floorSpawn.body.velocity.x = -this.birdSpeed;
  },

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

  create: function () {
    game.add.tileSprite(0, 0, 470, 470, 'background');
    // read about the next line at https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#disableVisibilityChange
    game.stage.disableVisibilityChange = true;

    this.bird = game.add.sprite(80, 240, 'bird');
    this.bird.anchor.set(0.5, 0.5);
    this.birdSpeed = 250;
    this.birdFlapPower = 500;
    this.birdJustCrossedPipes = false;
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 800;
    this.bird.body.collideWorldBounds = true;
    this.bird.body.bounce.setTo(0.3, 0.3);
    this.bird.body.setSize(50, 50, 5, 5);

    this.cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


    this.flapSound = game.add.audio('flap');
    this.rollingSound = game.add.audio('rolling');
    this.rollingSound.allowMultiple = false;
    this.screamSound = game.add.audio('scream');
    this.screamSound.volume -= 0.95;
    this.landingSound = game.add.audio('landing');
    this.landingSound.allowMultiple = false;

    this.pipes = game.add.group();
    this.pipeHole = 200;
    this.addPipe();

    this.ground = game.add.group();

    this.score = 0;
    this.scoreText = game.add.text(230, 20, '0', { font: '30px Arial', fill: '#ffffff' });

    //game.SPACEBAR.onDown.add(this.flap, this);
    game.time.events.loop(1000, this.addFloor, this);
    game.time.events.loop(2400, this.addPipe, this);

    sprite1 = game.add.sprite(0, 420, 'floor');
    sprite1.name = 'floor';
    game.physics.enable(sprite1, Phaser.Physics.ARCADE);
    sprite1.body.immovable = true;
    sprite1.body.velocity.x = -this.birdSpeed;

    sprite2 = game.add.sprite(300, 420, 'floor');
    sprite2.name = 'floor';
    game.physics.enable(sprite2, Phaser.Physics.ARCADE);
    sprite2.body.immovable = true;
    sprite2.body.velocity.x = -this.birdSpeed;
  },

  die: function () {
    game.state.start('main');
  },

  flap: function () {
    if (this.bird.y > 380){
      this.flapSound.play();
      //this.screamSound.play();
      this.bird.body.velocity.y = -this.birdFlapPower;
      this.bird.body.velocity.x = this.birdFlapPower/2;
    }
  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('bird', 'assets/bird1.png');
    game.load.image('pipe', 'assets/pipe1.png');
    game.load.audio('flap', 'assets/jump.mp3');
    game.load.image('floor', 'assets/floor1.png');
    game.load.image('background', 'assets/background1.png');
    game.load.audio('rolling', 'assets/rolling.mp3');
    game.load.audio('landing', 'assets/Landing.mp3');
    game.load.audio('scream', 'assets/scream.mp3');
  },

  update: function () {
    if (game.physics.arcade.overlap(this.bird, this.pipes)){
      this.die();
    }
    if (this.bird.y > game.height) {
      this.die();
    }

    game.camera.shake(0.005, 500);

    if (this.bird.y > 380){
      this.landingSound.play();
      this.landingSound.mute = true;
    }
    else{
      this.landingSound.mute = false;
    }


    if (this.bird.y < 380){
      game.camera.shake(0.00, 0);
    }

    this.bird.angle += 2;


    game.physics.arcade.collide(sprite1, this.bird);
    game.physics.arcade.collide(sprite2, this.bird);
    game.physics.arcade.collide(this.ground, this.bird);

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.flap();
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      this.bird.body.velocity.x = this.birdFlapPower/3;
    }
    else{
      this.bird.body.velocity.x = -this.birdFlapPower/3;
    }

    if (this.bird.y > 350){
      this.bird.body.velocity.x = -1;
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
