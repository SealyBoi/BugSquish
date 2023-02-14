let spriteSheet;
let ant;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
};

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 7, state: GameState.Start};

function preload() {
  spriteSheet = loadImage("images/Ant.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  reset();
}

function reset() {
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(10,15);

  animations = [];
  let move = 1;
  for(let i = 0; i < game.totalSprites; i++) {
    animations[i] = new AntAnimation(spriteSheet,60,60,random(100,300),random(100,300),5,move,-move);
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
      text("Press Any Key to Start",200,300);
      break;
  }
}

function keyPressed() {
  switch(game.state) {
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
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
            game.score += 1;
          }
        }
      }
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