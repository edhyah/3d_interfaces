let canvas = null;
let ctx = null;

const fontSize = 30;

// Mouse position
let startX;
let startY;

// List of dictionaries containing words that can be dragged into the prompt box
let availableWords = [];
// Index for `availableWords` for the word that is selected / is dragging
let selectedWordIndex = -1;

// List of dictionaries containing segments that are in the prompt box currently
// Note: There are at most 2 segments (0 segments if there are no words in the
// prompt box, 2 segments if the user is attempting to drag a word into the
// prompt box, 1 segment otherwise).
let promptSegments = [];

init();
draw();

function getPromptBoxBoundingBox() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    return {
        x: ww/2-ww/4*3/2,
        y: wh/2-100/2,
        width: ww/4*3,
        height: 100
    };
}

// Note: This method is different from `hitTestShape`.
function hitTestText(x, y, word) {
    const bboxX = word.x;
    const bboxY = word.y;
    const bboxWidth = word.width;
    const bboxHeight = word.height;
    return (bboxX <= x && x <= bboxX + bboxWidth
        && bboxY - bboxHeight <= y && y <= bboxY)
}

// Note: This method is different from `hitTestText`.
function hitTestShape(x, y, bboxX, bboxY, bboxWidth, bboxHeight) {
    return (bboxX <= x && x <= bboxX + bboxWidth
        && bboxY <= y && y <= bboxY + bboxHeight)
}

function getDividingIndex(x, y) {
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    const textBBoxX = ctx.measureText();
    //word1.width = ctx.measureText(word1.text).width;

    return 1;
}

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function onMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    for (let i = 0; i < availableWords.length; i++) {
        let word = availableWords[i];
        if (hitTestText(startX, startY, word)) {
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

    const dims = getPromptBoxBoundingBox();
    if (hitTestShape(startX, startY, dims.x, dims.y, dims.width, dims.height)) {
        const dividingIndex = getDividingIndex(startX, startY);
        console.log('word inside prompt box');
    }

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
    let word1 = {
        text: 'tacos',
        x: 100,
        y: 100
    };
    word1.width = ctx.measureText(word1.text).width;
    word1.height = fontSize;
    availableWords.push(word1);

    let word2 = {
        text: 'arm swing',
        x: 250,
        y: 100
    }
    word2.width = ctx.measureText(word2.text).width;
    word2.height = fontSize;
    availableWords.push(word2);
}

function getTestPrompt() {
    let segment = {
        text: 'hello world',
    }
    promptSegments.push(segment);
}

function init() {
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.font = fontSize + 'px sans-serif';

    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseout', onMouseOut);

    getTestAvailableWords();
    getTestPrompt();
}

function drawPrompt() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // Prompt box
    const dims = getPromptBoxBoundingBox();
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(dims.x, dims.y, dims.width, dims.height);

    // Words in prompt box
    if (promptSegments.length === 0) {
        return;
    } else if (promptSegments.length === 1) {
        const w = ctx.measureText(promptSegments[0].text).width;
        const h = fontSize - 15;  // TODO: investigate why subtracting 15 works
        ctx.fillText(promptSegments[0].text, ww/2 - w/2, wh/2 + h/2);
    } else if (promptSegments.length === 2){
        console.log('not implemented yet');
    } else {
        console.error('Internal error: too many segments in prompt.');
    }
}

function drawAvailable() {
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
    for (let i = 0; i < availableWords.length; i++) {
        let word = availableWords[i];
        ctx.fillText(word.text, word.x, word.y);
    }
}

function draw() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    ctx.clearRect(0, 0, ww, wh);
    drawPrompt();
    drawAvailable();
}
