var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var player = {radius: 15, x: canvas.width / 2, y: canvas.height / 2 + 40, color: "#0095DD"}
var ball = {radius: 10, x: canvas.width / 2, y: 12, color: "#ff0000"}
var dBall = [2, 2]
var tracker = {radius: 5, x: canvas.width / 2, y: 12, color: "#ffff00"}
var dTracker = [0, 0.5]
var target = {x: player.x, y: player.y}
var score = 0;
var level = 0;
var health = 10;
var animation = true;
var rightPressed = false;
var leftPressed = false;
var downPressed = false;
var upPressed = false;
var playPressed = false;
var rPressed = false;

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
    if(rightPressed && player.x + player.radius < canvas.width) {
    player.x += 7;
    }
    if(leftPressed && player.x - player.radius > 0) {
        player.x -= 7;
    }
    if(downPressed && player.y + player.radius < canvas.height) {
        player.y += 7;
    }
    if(upPressed && player.y - player.radius > 0) {
        player.y -= 7;
    }
}

function newBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    ball.x += dBall[0];
    ball.y += dBall[1];
}

var c = 0.5;

function newTracker() {
    ctx.beginPath();
    ctx.arc(tracker.x, tracker.y, tracker.radius, 0, Math.PI*2);
    ctx.fillStyle = tracker.color;
    ctx.fill();
    ctx.closePath();

    tracker.x += dTracker[0];
    tracker.y += dTracker[1];

    if(target.x != player.x) {
        if(tracker.x < player.x) {
            dTracker[0] = c;
        }
        else if(tracker.x > player.x) {
            dTracker[0] = -c;
        }
    }
    if(target.y != player.y) {
        if(tracker.y < player.y) {
            dTracker[1] = c;
        }
        else if(tracker.y > player.y) {
            dTracker[1] = -c;
        }
    }
}

function drawSpawnZone() {
    ctx.beginPath();
    ctx.rect(canvas.width / 2 - 25, 0, 50, 25);
    ctx.fillStyle = "#f00";
    ctx.fill();
    ctx.closePath();
    ctx.font = "14px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("ENJOY!", canvas.width / 2 - 25, 18);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 8, 20);
}

function scoreUp() {
    score += 5
}

function drawLevel() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Level: " + level, canvas.width - 75, 20);
}

function drawHealth() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Health: " + health, canvas.width - 175, 20);
}

function warning() {
    if(level == 8) {
        ctx.globalAlpha = "0.25"
        ctx.font = "30px Lucida Control";
        ctx.fillStyle = "#000";
        ctx.fillText("Warning, redball is drunk.", canvas.width / 2 - 180, canvas.height / 2 - 40);
        ctx.globalAlpha = "1";
    }
}

function instructions() {
    if(level == 0) {
        ctx.globalAlpha = "0.25"
        ctx.font = "30px Lucida Control";
        ctx.fillStyle = "#000";
        ctx.fillText("You Are Blue. Dodge Forever.", canvas.width / 2 - 180, canvas.height / 2 - 40);
        ctx.globalAlpha = "0.15";
        ctx.font = "45px Lucida Control";
        ctx.fillStyle = "#000";
        ctx.fillText("WASD | Arrow Keys", canvas.width / 2 - 186, canvas.height / 2 + 10);
        ctx.globalAlpha = "0.40"
        ctx.font = "20px Lucida Control";
        ctx.fillStyle = "#000";
        ctx.fillText("Press \"R\" to restart mid-game.", canvas.width / 2 - 186, canvas.height / 2 + 120);
        ctx.font = "20px Lucida Control";
        ctx.fillStyle = "#000";
        ctx.fillText("Refresh page to play again.", canvas.width / 2 - 186, canvas.height / 2 + 140);
        ctx.globalAlpha = "1.0"
    }
}

function gameOver() {
    if(health == 0) {
        dBall = [0, 0]
        dTracker = [0, 0]
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = "0.5"
        ctx.fillStyle = "#A9A9A9";
        ctx.fill();
        ctx.globalAlpha = "1.0"
        ctx.closePath();
        ctx.font = "60px Lucida Console";
        ctx.fillStyle = "#000";
        ctx.fillText("GAME OVER", canvas.width / 2 - 163, canvas.height / 2 - 20);
        ctx.font = "30px Lucida Console";
        ctx.fillStyle = "#f00";
        ctx.fillText("Score: " + score, canvas.width / 2 - 153, canvas.height / 2 + 30);
        ctx.font = "30px Lucida Console";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Level: " + level, canvas.width / 2 + 7, canvas.height / 2 + 70);
        ctx.font = "25px Lucida Console";
        ctx.fillStyle = "#ffff00";
        ctx.fillText("Press Space to play again", canvas.width / 2 - 187, canvas.height / 2 + 110);
        cancelAnimationFrame();
    }
}

function restart() {
    if(rPressed) {
        location.reload();
    }
}

function collision(object, vector) {
    var dx = player.x - object.x;
    var dy = player.y - object.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if(distance < player.radius + object.radius) {
        health--;
        vector[0] = -vector[0];
        vector[1] = -vector[1];
    }

}

function walls(object, vector) {
    if(object.x + object.radius > canvas.width || object.x - object.radius < 0) {
        vector[0] = -vector[0];
    }
    if(object.y + object.radius > canvas.height || object.y - object.radius < 0) {
        vector[1] = -vector[1];
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHealth();
    drawScore();
    drawLevel();
    drawSpawnZone();
    drawPlayer();
    newBall();
    newTracker();
    walls(ball, dBall);
    walls(tracker, dTracker);
    instructions();
    collision(ball, dBall);
    collision(tracker, dTracker);
    restart();
    warning();
    gameOver();
    requestAnimationFrame(animate);
}

var a = 2;
var b = 0.5;

function speedUp() {
    if(Math.abs(dBall[0]) >= 10 || Math.abs(dBall[1]) >= 10) {
        b = 0.1
        level++;
        dBall[0] = -dBall[0];
        dBall[1] = -dBall[1];
        if(dBall[0] > 0) {
            dBall[0] += b;
        }
        else if(dBall[0] < 0) {
            dBall[0] += -b;
        }
        if(dBall[1] > 0) {
            dBall[1] += b;
        }
        else if(dBall[1] < 0) {
            dBall[1] += -b;
        }
    }
    else {
        b += 0.2;
        level++;
        if(dBall[0] > 0) {
            dBall[0] += b;
        }
        else if(dBall[0] < 0) {
            dBall[0] += -b;
        }
        if(dBall[1] > 0) {
            dBall[1] += b;
        }
        else if(dBall[1] < 0) {
            dBall[1] += -b;
        }
    }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
/*document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    var relativeY = e.clientY - canvas.offsetTop;
    if(relativeX > 0 && relativeX < canvas.width) {
        player.x = relativeX;
    }
    if(relativeY > 0 && relativeY < canvas.height) {
        player.y = relativeY;
    }
}*/

function keyDownHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = true;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = true;
    }
    if(e.keyCode == 40 || e.keyCode == 83) {
        downPressed = true;
    }
    else if(e.keyCode == 38 || e.keyCode == 87) {
        upPressed = true;
    }
    if(e.keyCode == 82) {
        rPressed = true;
    }
    if(e.keyCode == 32) {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39 || e.keyCode == 68) {
        rightPressed = false;
    }
    else if(e.keyCode == 37 || e.keyCode == 65) {
        leftPressed = false;
    }
    if(e.keyCode == 40 || e.keyCode == 83) {
        downPressed = false;
    }
    else if(e.keyCode == 38 || e.keyCode == 87) {
        upPressed = false;
    }
    if(e.keyCode == 82) {
        rPressed = false;
    }
    if(e.keyCode == 32) {
        spacePressed = false;
    }
}

animate();
setInterval(speedUp, 5000);
setInterval(scoreUp, 100);