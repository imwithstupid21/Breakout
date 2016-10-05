// This will reference our <canvas> tag from our HTML
var canvas = document.getElementById("myPong");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Next, we'll get a 2d context from our canvas
// This will allow us to begin drawing on our <canvas>
var ctx = canvas.getContext("2d");

setInterval(draw, 10);

var radius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = -2;
var dy = -2;

// Paddle position variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
// Paddle controls
var rightPressed = false;
var leftPressed = false;
var dxPaddle = 7;

// These variables are for our brick field
var brickPadding = 10;
var brickW = 75;
var brickH = 10;
var fieldRows = 3;
var fieldCols = 5;
var score = 0;
var brickValue = 10;

var fieldTop = 30;
var fieldLeft = (canvas.width - ((fieldCols * brickW) + (brickPadding * (fieldCols - 1)))) / 2;

var bricks = [];
for (r=0; r < fieldRows; r++) {
    bricks[r] = [];
    for (c=0; c < fieldCols; c++) {
        bricks[r][c] = { x: 0, y: 0, alive: true };
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScore();
    drawBall();
    drawPaddle();

    if (score >= fieldRows * fieldCols * brickValue) {
        iAmSoAwesome();
    }

    collisionDetection();
    drawBricks();

    if (x + dx > canvas.width - radius || x + dx < radius) {
        dx = -dx;
    }
    if (y + dy < radius) {
        dy = -dy;
    } else if (y + dy > canvas.height - radius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gameOver();
        }
    }

    if (leftPressed && paddleX > 0) {
        paddleX -= dxPaddle;
    } else if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += dxPaddle;
    }

    x += dx;
    y += dy;
}

function collisionDetection() {
    for (r=0; r < fieldRows; r++) {
        for (c=0; c < fieldCols; c++) {
            var b = bricks[r][c];
            if (b.alive && y > b.y && y < b.y + brickH && x > b.x && x < b.x + brickW) {
                b.alive = false;
                dy = -dy;
                score += brickValue;
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillText("Score: "+score, 8, 20);
}

function gameOver() {
    alert("GAME OVER");
    document.location.reload();
}

function iAmSoAwesome() {
    alert("You win! Go buy yourself a cupcake!");
    document.location.reload();
}

function keyDownHandler(k) {
    if (k.keyCode == 37) {
        leftPressed = true;
    } else if (k.keyCode == 39) {
        rightPressed = true;
    } else if (k.keyCode == 32 && isGameOver) {
     document.location.reload();
   }
}

function keyUpHandler(k) {
    if (k.keyCode == 37) {
        leftPressed = false;
    }
    if (k.keyCode == 39) {
        rightPressed = false;
    }
}

function mouseMoveHandler(m) {
    var mouseX = m.clientX - canvas.offsetLeft;
    if (mouseX > 0 && mouseX < canvas.width) {
        paddleX = mouseX - paddleWidth/2;
    }
}

function drawBall() {
    ctx.beginPath();
    // arc(left, top, radius, startAngle, endAngle, counterclockwise)
    ctx.arc(x, y, radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (r=0; r < fieldRows; r++) {
        for (c=0; c < fieldCols; c++) {
            bricks[r][c].x = (c*(brickW + brickPadding)) + fieldLeft;
            bricks[r][c].y = (r*(brickH + brickPadding)) + fieldTop;

            if (bricks[r][c].alive) {
                ctx.beginPath();
                ctx.rect(bricks[r][c].x, bricks[r][c].y, brickW, brickH);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
