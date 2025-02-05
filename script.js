const board = document.getElementById('board');
const logo = document.getElementById('logo');
const instruction = document.getElementById('instruction');
const currentScore = document.getElementById('current-score-value');
const highScore = document.getElementById('high-score-value');

let gameStarted = false;
let snake = [{x:10, y:10}];
let food = generateFood();
let direction = 'right';
let gridSize = 20;
let gameInterval;
let gameSpeedDelay = 200;
let highScoreValue = 0;

function draw(){
    board.innerHTML ='';
    drawFood();
    drawSnake();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment)=>{
        let snakeElement=createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
        })
}

function createGameElement(tagName,className)
{
    let gameElement = document.createElement(tagName);
    gameElement.className = className;
    return gameElement;
}

function setPosition(gameElement,position)
{
    gameElement.style.gridColumn=position.x;
    gameElement.style.gridRow=position.y;
}

function drawFood(){
    if(gameStarted){
        let foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }
}

function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

function move()
{
    let head={...snake[0]};
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
    }
    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
            move();
            checkCollisions();
            draw()
        },gameSpeedDelay);
    }
    else{
        snake.pop();
    }
}

function startGame()
{
    gameStarted = true;
    logo.style.display = 'none';
    instruction.style.display = 'none';
    draw();
    gameInterval = setInterval(()=>{
        move();
        checkCollisions();
        draw();
    },gameSpeedDelay);
}

function handleKeyPress(event)
{
    if(!gameStarted && (event.code === 'Space' || event.key === ' ')){
        startGame();
    }
    else if (gameStarted){
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay > 200){
        gameSpeedDelay -= 5;
    }
    else if(gameSpeedDelay > 150){
        gameSpeedDelay -= 3;
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }
    else {
        gameSpeedDelay -= 1;
    }
}

function checkCollisions(){
    let head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    for(let i=1; i<snake.length;i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    direction='right';
    food=generateFood();
    snake=[{x:10,y:10}];
    gameSpeedDelay=200;
    updateScore();
}

function updateScore(){
    let score = snake.length - 1;
    currentScore.textContent = score.toString().padStart(3,'0');
}

function updateHighScore(){
    let score = snake.length - 1;
    if(score > highScoreValue)
    {
       highScoreValue = score;
       highScore.textContent = highScoreValue.toString().padStart(3,'0');
    }
    highScore.style.display = 'block'
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instruction.style.display='block';
    logo.style.display='block';
}


