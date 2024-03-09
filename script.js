/** CONSTANTS **/
const CANVAS_BORDER_COLOUR = "white";
const CANVAS_BACKGROUND_COLOUR = "white";
let SNAKE_COLOUR = "lightgreen";
let SNAKE_BORDER_COLOUR = "darkgreen";
const FOOD_COLOUR = "red";
const FOOD_BORDER_COLOUR = "darkred";

let snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
];

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

let foodX;
let foodY;
let changingDirection = false;

let score = 0;

const gameover = document.getElementById("gameover");
const restart = document.getElementById("restart");
restart.addEventListener("click", () => {
    location.reload();
});

// Get the canvas element
var gameCanvas = document.getElementById("gameCanvas");

// Return a two dimensional drawing context
var ctx = gameCanvas.getContext("2d");

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

//   createFood();
main();
document.addEventListener("keydown", changeDirection);

function changeSnakeColor() {
    let flag = 1;

    setInterval(() => {
        if (flag == 1) {
            SNAKE_COLOUR = '#AFC8AD';
            SNAKE_BORDER_COLOUR = '#F2F1EB';
            flag = 0;
        } else {
            SNAKE_COLOUR = '#BFD3BD';
            SNAKE_BORDER_COLOUR = '#F2F1EB';
            flag = 1;
        }
        drawSnake();
    }, 400);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    if (foodX == undefined || foodY == undefined) {
        createFood();
    }
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokeStyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function main() {
    if (didGameEnd()) {
        // alert(`Game Over! Your Score is ${score}`);
        gameover.style.visibility = "visible";
        changeSnakeColor();
        return;
    }
    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        // Call main again
        main();
    }, 100);
}

//   endgame
function didGameEnd() {
    // collide with itself
    for (i = 4; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) return true;
    }

    //   hit a wall
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/**
 * Advances the snake by changing the x-coordinates of its parts
 * according to the horizontal velocity and the y-coordinates of its parts
 * according to the vertical veolocity
 */
function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    let didEatFood = snake[0].x == foodX && snake[0].y == foodY;

    if (didEatFood) {
        score += 10;
        document.getElementById("score").innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}

/**
 * Draws the snake on the canvas
 */
function drawSnake() {
    // loop through the snake parts drawing each part on the canvas
    snake.forEach(drawSnakePart);
}

//  Draws a part of the snake on the canvas
function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = SNAKE_COLOUR;

    // Set the border colour of the snake part
    ctx.strokeStyle = SNAKE_BORDER_COLOUR;

    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

//   Change the direction of the snake
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Prevent the snake from reversing
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}