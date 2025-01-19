 // Set up the canvas and game context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
let canvasWidth = window.innerWidth * 0.9; // 90% of screen width
let canvasHeight = window.innerHeight * 0.7; // 70% of screen height

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Bird settings (scaled)
let bird = {
    x: 50,
    y: canvasHeight / 2,
    width: canvasWidth * 0.07, // 7% of canvas width
    height: canvasWidth * 0.07, // 7% of canvas width
    velocity: 0,
    gravity: 0.6,
    lift: -15,
};

// Pipe settings
let pipes = [];
const pipeWidth = canvasWidth * 0.12; // 12% of canvas width
const pipeGap = canvasHeight * 0.25; // 25% of canvas height
const pipeSpeed = 2;

// Game variables
let score = 0;
let isGameOver = false;

// Draw the bird
function drawBird() {
    ctx.fillStyle = "#FF0";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw the pipes
function drawPipes() {
    ctx.fillStyle = "#228B22";
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvasHeight - pipe.bottom);
    }
}

// Move the bird
function moveBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent the bird from falling below the canvas
    if (bird.y > canvasHeight - bird.height) {
        bird.y = canvasHeight - bird.height;
        bird.velocity = 0;
    }
}

// Create pipes
function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvasHeight - pipeGap));
    pipes.push({
        x: canvasWidth,
        top: pipeHeight,
        bottom: pipeHeight + pipeGap,
        scored: false
    });
}

// Move pipes
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }

    // Remove pipes that pass off screen
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Check for collisions
function checkCollisions() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) {
                isGameOver = true;
            }
        }
    }

    if (bird.y <= 0) {
        isGameOver = true;
    }
}

// Update score
function updateScore() {
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].x + pipeWidth < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true;
        }
    }
}

// Draw score (in a fixed score column at the top)
function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = Math.min(canvasWidth * 0.08, 30) + "px Arial"; // Font size scaled based on canvas width
    ctx.fillText("Score: " + score, 20, 50); // Display score at top left corner
}

// Game Over screen
function gameOver() {
    ctx.fillStyle = "#000";
    ctx.font = Math.min(canvasWidth * 0.1, 50) + "px Arial"; // Scaled font for Game Over
    ctx.fillText("Game Over", canvasWidth / 4, canvasHeight / 2);
    ctx.font = Math.min(canvasWidth * 0.08, 30) + "px Arial"; // Font for Restart
    ctx.fillText("Tap to Restart", canvasWidth / 4, canvasHeight / 1.5);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!isGameOver) {
        moveBird();
        movePipes();
        checkCollisions();
        updateScore();  // Update the score
        drawBird();
        drawPipes();
        drawScore();  // Draw the score
        requestAnimationFrame(gameLoop);
    } else {
        gameOver();
    }
}

// Start a new game
function startGame() {
    bird.y = canvasHeight / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    gameLoop();
}

// Handle bird flap (click or touch event)
function handleFlap() {
    if (isGameOver) {
        startGame();  // Restart the game if it's over
    } else {
        bird.velocity = bird.lift;  // Make the bird flap
    }
}

// Add event listeners for mouse click and touch events
window.addEventListener("click", handleFlap);
window.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    handleFlap();
});

// Generate pipes at intervals
setInterval(createPipe, 1500);  // Generate pipes every 1.5 seconds

// Adjust the canvas size dynamically when the window is resized
window.addEventListener("resize", () => {
    canvasWidth = window.innerWidth * 0.9;
    canvasHeight = window.innerHeight * 0.7;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Re-adjust bird and pipe sizes when resizing
    bird.width = canvasWidth * 0.07;
    bird.height = canvasWidth * 0.07;
    // Re-adjust font sizes based on the new canvas size
    ctx.font = Math.min(canvasWidth * 0.08, 30) + "px Arial";
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas to avoid rendering issues
});
// Load bird image
const birdImage = new Image();
birdImage.src = 'bird.png'; // Replace 'bird.png' with the correct path to your bird image
birdImage.onload = function () {
    console.log('Bird image loaded');
};

// Draw the bird
function drawBird() {
    if (birdImage.complete) { // Ensure the bird image is loaded before drawing
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    } else {
        // Fallback: Draw a rectangle if the image isn't loaded yet
        ctx.fillStyle = "#FF0";
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }
}
// Load a new pipe image (ensure the image path is correct)
const pipeImage = new Image();
pipeImage.src = 'newpipe.png'; // Replace with the path to your new pipe image

// Add menu screen variables
let showMenu = true;

// Draw the menu screen
function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Background color
    ctx.fillStyle = "#ADD8E6"; // Light blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game Title
    ctx.fillStyle = "#000";
    ctx.font = Math.min(canvasWidth * 0.1, 50) + "px Arial"; // Scaled title font
    ctx.textAlign = "center";
    ctx.fillText("Flappy Bird", canvasWidth / 2, canvasHeight / 4);

    // Draw Start Button
    ctx.fillStyle = "#28a745"; // Green
    const startButton = {
        x: canvasWidth / 3,
        y: canvasHeight / 2,
        width: canvasWidth / 3,
        height: canvasHeight / 10,
    };
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);

    ctx.fillStyle = "#FFF"; // White text
    ctx.font = Math.min(canvasWidth * 0.06, 30) + "px Arial";
    ctx.fillText("Start", startButton.x + startButton.width / 2, startButton.y + startButton.height / 2 + 10);

    // Draw Quit Button
    ctx.fillStyle = "#dc3545"; // Red
    const quitButton = {
        x: canvasWidth / 3,
        y: canvasHeight / 2 + canvasHeight / 8,
        width: canvasWidth / 3,
        height: canvasHeight / 10,
    };
    ctx.fillRect(quitButton.x, quitButton.y, quitButton.width, quitButton.height);

    ctx.fillStyle = "#FFF"; // White text
    ctx.fillText("Quit", quitButton.x + quitButton.width / 2, quitButton.y + quitButton.height / 2 + 10);

    // Save button dimensions for click detection
    return { startButton, quitButton };
}

// Handle menu interactions
function handleMenuClick(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    const { startButton, quitButton } = drawMenu(); // Get button dimensions

    // Check if Start button is clicked
    if (
        mouseX >= startButton.x &&
        mouseX <= startButton.x + startButton.width &&
        mouseY >= startButton.y &&
        mouseY <= startButton.y + startButton.height
    ) {
        showMenu = false; // Hide menu
        startGame(); // Start the game
    }

    // Check if Quit button is clicked
    if (
        mouseX >= quitButton.x &&
        mouseX <= quitButton.x + quitButton.width &&
        mouseY >= quitButton.y &&
        mouseY <= quitButton.y + quitButton.height
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.fillStyle = "#000";
        ctx.font = Math.min(canvasWidth * 0.08, 30) + "px Arial"; // Scaled font
        ctx.textAlign = "center";
        ctx.fillText("Goodbye!", canvasWidth / 2, canvasHeight / 2); // Goodbye message
    }
}

// Modify the game loop to show the menu
function gameLoop() {
    if (showMenu) {
        drawMenu(); // Show the menu screen
    } else if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveBird();
        movePipes();
        checkCollisions();
        updateScore();
        drawBird();
        drawPipes();
        drawScore();
        requestAnimationFrame(gameLoop);
    } else {
        gameOver();
    }
}

// Add event listener for menu clicks
canvas.addEventListener("click", handleMenuClick);

// Start by showing the menu
drawMenu();


startGame();  // Start the game when the page loads

