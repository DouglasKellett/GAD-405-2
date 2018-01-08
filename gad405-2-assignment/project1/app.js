const mainState = {
  addPipe: function () {
    const pipeHolePosition = game.rnd.between(50, 430 - this.pipeHole);

    const upperPipe = this.pipes.create(320, pipeHolePosition - 480, 'pipe');
    game.physics.arcade.enable(upperPipe);
    upperPipe.body.velocity.x = -this.birdSpeed;
    upperPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    const lowerPipe = this.pipes.create(320, 400, 'pipe');
    game.physics.arcade.enable(lowerPipe);
    lowerPipe.body.velocity.x = -this.birdSpeed;
    lowerPipe.events.onOutOfBounds.add((pipe) => {
      pipe.destroy();
    });

    this.birdJustCrossedPipes = false;
  },

  create: function () {
    game.stage.backgroundColor = '#87CEEB';
    // read about the next line at https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#disableVisibilityChange
    game.stage.disableVisibilityChange = true;

    this.bird = game.add.sprite(80, 240, 'bird');
    this.bird.anchor.set(0.5);
    this.birdSpeed = 125;
    this.birdFlapPower = 300;
    this.birdJustCrossedPipes = false;
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 800;

    this.flapSound = game.add.audio('flap');

    this.pipes = game.add.group();
    this.pipeHole = 120;
    this.addPipe();

    this.score = 0;
    this.scoreText = game.add.text(175, 20, '0', { font: '30px Arial', fill: '#ffffff' });

    game.input.onDown.add(this.flap, this);
    game.time.events.loop(2000, this.addPipe, this);
  },

  die: function () {
    game.state.start('main');
  },

  flap: function () {
    this.flapSound.play();
    this.bird.body.velocity.y = -this.birdFlapPower;
  },

  preload: function () {
    game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.audio('flap', 'assets/jump.mp3');
  },

  update: function () {
    game.physics.arcade.overlap(this.bird, this.pipes, this.die, null, this);
    if (this.bird.y > game.height) {
      this.die();
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

const game = new Phaser.Game(350, 490);
game.state.add('main', mainState);
game.state.start('main');
