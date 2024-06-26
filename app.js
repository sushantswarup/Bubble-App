// Getting the canvas element and its 2d context
const canvas = document.getElementById('myCanvas');
const canvasContext = canvas.getContext('2d');
// Getting the element to display the score
const scoreElement = document.getElementById('score');

// Initial positions, colors, and relationships for circles and arrows
const circles = [
    { x: 100, y: 100, radius: 35, color: 'red', hitColor: 'pink' },
    { x: 100, y: 200, radius: 35, color: 'green', hitColor: 'lightgreen' },
    { x: 100, y: 300, radius: 35, color: 'blue', hitColor: 'lightblue' },
    { x: 100, y: 400, radius: 35, color: 'yellow', hitColor: 'lightyellow' },
];

const arrows = [
    { x: 680, y: 100, targetIndex: 0 },
    { x: 680, y: 200, targetIndex: 1 },
    { x: 680, y: 300, targetIndex: 2 },
    { x: 680, y: 400, targetIndex: 3 },
];
let score = 0; // Initialize score

// Initialize variables for the active arrow and animation frame
let activeArrow = null;
let animationFrame;

// Function to draw a circle
function drawCircle(circle) {
    canvasContext.beginPath();
    canvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    canvasContext.fillStyle = circle.color;
    canvasContext.fill();
    canvasContext.strokeStyle = 'black'; // Border color
    canvasContext.lineWidth = 2; // Border width
    canvasContext.stroke(); // Draw the border
    canvasContext.closePath();
}

// Function to draw an arrow
function drawArrow(arrow) {
    canvasContext.beginPath();
    canvasContext.moveTo(arrow.x, arrow.y);
    canvasContext.lineTo(arrow.x + 20, arrow.y - 10);
    canvasContext.lineTo(arrow.x + 20, arrow.y + 10);
    // Tail part
    canvasContext.moveTo(arrow.x +40, arrow.y +10); // Start of tail
    canvasContext.lineTo(arrow.x, arrow.y); // Tip of tail
    canvasContext.lineTo(arrow.x +40, arrow.y -10); // End of tail
    
    canvasContext.closePath();
    canvasContext.fillStyle = 'black';
    canvasContext.fill();
}

// Function to draw all circles and arrows
function draw() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(drawCircle);
    arrows.forEach(drawArrow);
}

// Function to update the score
function updateScore() {
    score += 10;
    scoreElement.innerText = `Score: ${score}`;
}

// Function to reset the score
function resetScore() {
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
}

// Function to reset the game
function reset() {
    // Reset circle colors
    circles[0].color = 'red';
    circles[1].color = 'green';
    circles[2].color = 'blue';
    circles[3].color = 'yellow';

    // Reset arrow positions
    arrows.forEach(arrow => arrow.x = 700);

    activeArrow = null;
    resetScore();
    draw();
}

// Function to animate the arrow movement
function animateArrow() {
    if (!activeArrow ) return;
    const targetCircle = circles[activeArrow.targetIndex];
    if (activeArrow.x > targetCircle.x + targetCircle.radius) {
        activeArrow.x -= 5;
        draw();
        animationFrame = requestAnimationFrame(animateArrow);
    } else {
        targetCircle.color = targetCircle.hitColor;
        draw();
        updateScore(); // Update score when arrow hits the circle
        activeArrow = null;
        cancelAnimationFrame(animationFrame);
    }
}

// Event listener for canvas (click to check for arrow hits on circles)
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    circles.forEach((circle, index) => {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
        if (distance < circle.radius) {
            activeArrow = arrows.find(arrow => arrow.targetIndex === index);
            animateArrow();
        }
    });
});

// Event listener for reset click
document.getElementById('resetButton').addEventListener('click', reset);

// Initial drawing of circles and arrows
draw();
