let canvas = null;
let ctx = null;

// Mouse position
let startX;
let startY;

// List of all available words surrounding middle box
let availableWords = [];
let selectedWordIndex = -1;

init();
draw();

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function hitTest(x, y, bboxX, bboxY, bboxWidth, bboxHeight) {
    return (bboxX <= x && x <= bboxX + bboxWidth
        && bboxY - bboxHeight <= y && y <= bboxY)
}

function onMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    for (let i = 0; i < availableWords.length; i++) {
        let word = availableWords[i];
        if (hitTest(startX, startY, word.x, word.y, word.width, word.height)) {
            selectedWordIndex = i;
            return;
        }
    }
}

function onMouseMove(e) {
    if (selectedWordIndex < 0) return;

    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let word = availableWords[selectedWordIndex];
    word.x += dx;
    word.y += dy;

    draw();
    startX = mouseX;
    startY = mouseY;
}

function onMouseUp() {
    selectedWordIndex = -1;
}

function onMouseOut() {
    selectedWordIndex = -1;
}

// Delete this once WebSpeech API is integrated
function getTestAvailableWords() {
    ctx.font = '30px serif';

    let word1 = {
        text: 'tacos',
        x: 100,
        y: 100
    };
    word1.width = ctx.measureText(word1.text).width;
    word1.height = 30;
    availableWords.push(word1);

    let word2 = {
        text: 'arm swing',
        x: 250,
        y: 100
    }
    word2.width = ctx.measureText(word2.text).width;
    word2.height = 30;
    availableWords.push(word2);
}

function init() {
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseout', onMouseOut);

    getTestAvailableWords();
}

function draw() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    ctx.clearRect(0, 0, ww, wh);

    // Middle box
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(ww/2-ww/4*3/2, wh/2-100/2, ww/4*3, 100);
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Hello world', ww/2, wh/2);

    // Render available words above middle box
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    for (let i = 0; i < availableWords.length; i++) {
        let word = availableWords[i];
        ctx.fillText(word.text, word.x, word.y);
    }
}
