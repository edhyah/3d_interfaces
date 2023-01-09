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
    return 1;
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    const textBBoxX = ctx.measureText();
    //word1.width = ctx.measureText(word1.text).width;

    return 1;
}

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.font = fontSize + 'px sans-serif';
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
    let word1 = { text: 'hello' };
    word1.width = ctx.measureText(word1.text).width;
    let word2 = { text: 'world' };
    word2.width = ctx.measureText(word2.text).width;
    let segment1 = [word1, word2];
    promptSegments.push(segment1);

    let word3 = { text: 'javascript' };
    word3.width = ctx.measureText(word3.text).width;
    let word4 = { text: 'guilt' };
    word4.width = ctx.measureText(word4.text).width;
    let segment2 = [word3, word4];

    promptSegments.push(segment2);
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

// Draws either 1 or 2 segments inside the prompt box.
function drawSegments(segments, offset) {
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    // Update the x values for each word and compute cumulative width of segment
    let cumulativeText = '';
    let cumulativeWidth = 0;
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        for (let j = 0; j < segment.length; j++) {
            const word = segment[j];
            if (cumulativeText.length !== 0) {
                cumulativeText += ' ';
                cumulativeWidth += 8.335; // ctx.measureText(' ').width
            }
            word.x = cumulativeWidth;
            cumulativeText += word.text;
            cumulativeWidth += word.width;
        }
    }

    // Render words together
    const initialX = ww/2 - cumulativeWidth/2;
    const initialY = wh/2 + (fontSize - 15)/2; // TODO: why does this work
    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        for (let j = 0; j < segment.length; j++) {
            const word = segment[j];
            const wordX = word.x + initialX + offset/2 * (i === 0 ? -1 : 1);
            const wordY = initialY;
            ctx.fillText(word.text, wordX, wordY);
        }
    }
}

function drawPrompt() {
    // Prompt box
    const dims = getPromptBoxBoundingBox();
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(dims.x, dims.y, dims.width, dims.height);

    // Words in prompt box
    if (promptSegments.length === 0) {
        return;
    } else if (promptSegments.length === 1) {
        drawSegments(promptSegments, 0);
    } else if (promptSegments.length === 2){
        const offset = ctx.measureText('arm swing').width + 8.335;
        drawSegments(promptSegments, offset);
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
