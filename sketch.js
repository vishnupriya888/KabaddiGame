var database;
var player1, player2, playerAnimation1, playerAnimation2;
var posPlayer1, posPlayer2;
var gameState;
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var toss;

function preload() {
  playerAnimation2 = loadAnimation(
    "assets/player001.png",
    "assets/player002.png"
  );
  playerAnimation1 = loadAnimation(
    "assets/player003.png",
    "assets/player004.png"
  );
}

function setup() {
  createCanvas(600, 600);
  database = firebase.database();

  reset = createButton("Reset");
  reset.position(20, 20);
  reset.mousePressed(() => {
    database.ref("/").update({
      gameState: 0,
      player1Score: 0,
      player2Score: 0,
      player1: null,
      player2: null,
    });
  });

  var gameStateRef = database.ref("gameState");
  gameStateRef.on("value", (data) => {
    gameState = data.val();
  });

  var player1ScoreRef = database.ref("player1Score");
  player1ScoreRef.on("value", (data) => {
    scorePlayer1 = data.val();
  });

  var player2ScoreRef = database.ref("player2Score");
  player2ScoreRef.on("value", (data) => {
    scorePlayer2 = data.val();
  });

  player1 = createSprite(400, 300);
  player1.addAnimation("player1 moving", playerAnimation1);
  player1.setCollider("circle", 0, 0, 40);
  player1.debug = true;
  playerAnimation1.frameDelay = 200;
  player1.scale = -0.5;

  var playerPositionRef1 = database.ref("player1/position");
  playerPositionRef1.on("value", (data) => {
    posPlayer1 = data.val();
    player1.x = posPlayer1.x;
    player1.y = posPlayer1.y;
  });

  player2 = createSprite(200, 300);
  player2.addAnimation("player2 moving", playerAnimation2);
  player2.setCollider("circle", 0, 0, 40);
  player2.debug = true;
  playerAnimation2.frameDelay = 200;
  player2.scale = 0.5;

  var playerPositionRef2 = database.ref("player2/position");
  playerPositionRef2.on("value", (data) => {
    posPlayer2 = data.val();
    player2.x = posPlayer2.x;
    player2.y = posPlayer2.y;
  });
}

function draw() {
  background("white");

  textSize(20);
  fill("red");
  text("RED: " + scorePlayer2, 170, 20);
  fill("yellow");
  text("YELLOW: " + scorePlayer1, 350, 20);

  for (var num = 0; num <= 600; num = num + 20) line(300, num, 300, num + 10);

  for (var num = 0; num <= 600; num = num + 20) {
    strokeWeight(3);
    stroke("yellow");
    line(100, num, 100, num + 10);
  }

  for (var num = 0; num <= 600; num = num + 20) {
    strokeWeight(3);
    stroke("red");
    line(500, num, 500, num + 10);
  }

  if (gameState === 0) {
    textSize(20);
    stroke("black");
    text("Press 'Space' to toss", 220, 200);
  }

  if (gameState === 2) {
    if (player2.x > 500) {
      writeScore(-5, 5);
      alert("RED WON");
      updateState(0);
    }

    if (player1.isTouching(player2)) {
      writeScore(5, -5);
      alert("RED LOST");
      updateState(0);
    }
  }

  if (gameState === 1) {
    if (player1.x < 100) {
      writeScore(5, -5);
      alert("YELLOW WON");
      updateState(0);
    }

    if (player1.isTouching(player2)) {
      writeScore(-5, 5);
      alert("YELLOW LOST");
      updateState(0);
    }
  }

  drawSprites();
}

function writePosition1(x, y) {
  database.ref("player1/position").update({
    x: posPlayer1.x + x,
    y: posPlayer1.y + y,
  });
}

function writePosition2(x, y) {
  database.ref("player2/position").update({
    x: posPlayer2.x + x,
    y: posPlayer2.y + y,
  });
}

function updateState(s) {
  database.ref("/").update({
    gameState: s,
  });
}

function updateToss(t) {
  database.ref("/").update({
    toss: t,
  });
}

function writeScore(s1, s2) {
  database.ref("/").update({
    player1Score: scorePlayer1 + s1,
    player2Score: scorePlayer2 + s2,
  });
}

function resetPosition1() {
  database.ref("player1/position").update({
    x: 400,
    y: 300,
  });
}

function resetPosition2() {
  database.ref("player2/position").update({
    x: 200,
    y: 300,
  });
}

function keyPressed() {
  if (keyCode === 32 && gameState === 0) {
    resetPosition1();
    resetPosition2();
    toss = Math.round(random(1, 2));
    if (toss === 1) {
      updateState(1);
      alert("YELLOW RIDE");
    } else {
      updateState(2);
      alert("RED RIDE");
    }
  }

  if (keyCode === LEFT_ARROW && gameState === 1) {
    writePosition1(-5, 0);
  }
  if (keyCode === RIGHT_ARROW && gameState === 1) {
    writePosition1(+5, 0);
  }
  if (keyCode === UP_ARROW) {
    writePosition1(0, -5);
  }
  if (keyCode === DOWN_ARROW) {
    writePosition1(0, +5);
  }

  if (keyCode === 65 && gameState === 2) {
    writePosition2(-5, 0);
  }
  if (keyCode === 68 && gameState === 2) {
    writePosition2(+5, 0);
  }
  if (keyCode === 87) {
    writePosition2(0, -5);
  }
  if (keyCode === 83) {
    writePosition2(0, +5);
  }
}
