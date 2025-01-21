let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

const gridSize = 20;

let score = 0;
let snake = [{
    x: Math.floor(Math.random()*(canvas.width/gridSize))*gridSize,
    y: Math.floor(Math.random()*(canvas.height/gridSize))*gridSize,
}];
let direction = {x: 0 , y : 0};

let food = {
    x: Math.floor(Math.random()*(canvas.width/gridSize))*gridSize,
    y: Math.floor(Math.random()*(canvas.height/gridSize))*gridSize,
};

const headImage = new Image();
headImage.src = "./Image/snake-head.png";

const bodyImage = new Image();
bodyImage.src = "./Image/snake-body.png";

const foodImage = new Image();
foodImage.src = "./Image/food.jpg";
foodImage.style.width = "250px";

const eatSound = new Audio("./sound/eatSound.mp3");
const failSound = new Audio("./sound/failSound.mp3");



function drawSnake() {
    snake.forEach((segment , index) => {
        if (index === 0) {
            ctx.drawImage(headImage,segment.x,segment.y,gridSize,gridSize);
        } else {
            ctx.drawImage(bodyImage,segment.x,segment.y,gridSize,gridSize);
        }
    })
}

function drawFood() {
    ctx.drawImage(foodImage,food.x,food.y,gridSize,gridSize);
}

function moveSnake() {
    let head = {
        x: snake[0].x + direction.x*gridSize,
        y: snake[0].y + direction.y*gridSize,
    }

    if (head.x > canvas.width) {
        head.x = canvas.width - ((canvas.width / gridSize )*gridSize);
    } else if (head.x <0) {
        head.x = canvas.width - gridSize;
    }

    if (head.y > canvas.height) {
        head.y = canvas.height - ((canvas.height / gridSize)*gridSize);
    } else if (head.y <0) {
        head.y = canvas.height - gridSize;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        eatSound.play();
        food = {
            x: Math.floor(Math.random()*(canvas.width/gridSize))*gridSize,
            y: Math.floor(Math.random()*(canvas.height/gridSize))*gridSize,
        }
    } else {
        snake.pop();
    }
    document.getElementById("score").innerHTML = `Score: ${score}`;
}

function checkCollision() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    if(checkCollision()) {
        failSound.play();
        Swal.fire({
            title: `Game Over!`,
            text: `Your score: ${score}`,
            confirmButtonText: "OK",
            width: 600,
            padding: "3em",
            color: "#716add",
            background: "#fff url(/images/trees.png)",
            backdrop: `
                rgba(0,0,123,0.4)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
            `
        }).then(() => {
            document.location.reload();
        });

        return;
    }
    setTimeout(() => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawFood();
        moveSnake();
        drawSnake();
        gameLoop()
    }, 50);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction.y === 0) {
        direction = {x: 0 , y : -1};
    } else if ( e.key === "ArrowDown" && direction.y === 0) {
        direction = {x: 0 , y : 1};
    } else if ( e.key === "ArrowLeft" && direction.x === 0 ) {
        direction = {x: -1 , y : 0};
    } else if ( e.key === "ArrowRight" && direction.x === 0) {
        direction = {x : 1 , y : 0};
    }
})

document.addEventListener("keydown", (e) => {
    if (e.key === "w" && snake[0].y !== 1) {
        direction = {x: 0 , y : -1};
    } else if ( e.key === "s" && snake[0].y !== -1) {
        direction = {x: 0 , y : 1};
    } else if ( e.key === "a" && snake[0].x !== 1 ) {
        direction = {x: -1 , y : 0};
    } else if ( e.key === "d" && snake[0].x !== -1) {
        direction = {x : 1 , y : 0};
    }
})

gameLoop()