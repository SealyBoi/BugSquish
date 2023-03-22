let spriteSheet;
let ant;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let squish = new Tone.Player('sounds/ow.mp3');
let miss = new Tone.Player('sounds/osrs.mp3');
let loss = new Tone.Player('sounds/oof.mp3');
let win = new Tone.Player('sounds/creeper.mp3');

let game = { score: 0, maxScore: 0, maxTime: 10, elapsedTime: 0, totalSprites: 7, state: GameState.Start};

function preload() {
  spriteSheet = loadImage("images/Ant.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  squish.toDestination();
  miss.toDestination();
  loss.toDestination();
  win.toDestination();

  reset();
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,15);

  animations = [];
  let move;
  for(let i = 0; i < game.totalSprites; i++) {
    move = random(1,5);
    animations[i] = new AntAnimation(spriteSheet,60,60,random(100,300),random(100,300),5,move,-move/move);
    move = -move;
  }
}

function draw() {
  switch(game.state) {
    case GameState.Playing:
      background(220);
      for(let i = 0; i < animations.length; i++) {
        animations[i].draw();
      }
      fill(0);
      textSize(40);
      text(game.score,20,40);
      let currentTime = game.maxTime - game.elapsedTime;
      text(ceil(currentTime),300,40);
      game.elapsedTime += deltaTime/1000;

      if (currentTime < 0) {
        game.state = GameState.GameOver;
        loss.start();
        Tone.Transport.stop();
      }
      if (game.score > 10) {
        game.state = GameState.GameOver;
        win.start();
        Tone.Transport.stop();
      }
      break;
    case GameState.GameOver:
      game.maxScore = max(game.score, game.maxScore);

      background(0);
      fill(255);
      textSize(40);
      textAlign(CENTER);
      text("Game Over!",200,200);
      textSize(35);
      text("Score: " + game.score,200,270);
      text("Max Score: " + game.maxScore,200,320);
      break;
    case GameState.Start:
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("Bug Squish",200,200);
      textSize(30);
      text("Click Mouse to Start",200,300);
      break;
  }
}

function mousePressed() {
  switch(game.state) {
    case GameState.Playing:
      for (let i = 0; i < animations.length; i++) {
        let contains = animations[i].contains(mouseX,mouseY);
        if (contains) {
          if (animations[i].moving != 0) {
            animations[i].stop();
            squish.start();
            game.score += 1;
          }
        } else {
          miss.start();
        }
      }
      break;
    case GameState.Start:
      Tone.Transport.start();
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      Tone.Transport.start();
      game.state = GameState.Playing;
      break;
  }
}

class AntAnimation {
  constructor(spriteSheet, sw, sh, dx, dy, animationLength, moving, xDirection) {
    this.spriteSheet = spriteSheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = moving;
    this.xDirection = xDirection;
  }

  draw() {
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;

    push();
    translate(this.dx,this.dy);
    scale(this.xDirection,1);

    image(this.spriteSheet,0,0,this.sw,this.sh,this.u*this.sw,this.v*this.sh,this.sw,this.sh);
    pop();

    if (frameCount % 6 == 0) {
      this.currentFrame++;
    }
  
    this.dx += this.moving;
    if (this.dx >= width - 25) {
      this.moving = -this.moving;
      this.xDirection = -this.xDirection;
    } else if (this.dx <= 25) {
      this.moving = -this.moving;
      this.xDirection = -this.xDirection;
    }
  }

  contains(x,y) {
    let insideX = x >= this.dx - 20 && x <= this.dx + 21;
    let insideY = y >= this.dy - 20 && y <= this.dy + 20;
    return insideX && insideY;
  }

  stop() {
    this.moving = 0;
    this.u = 5;
    this.v = 0;
  }
}