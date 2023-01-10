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
    const ww = window.innerWidth;
    const wh = window.innerHeight;
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

function divideToPromptSegments(x, y) {
    const leftSegment = [];
    const rightSegment = [];

    let dividedSegment = 0;
    let dividingIndex = -1;
    let stop = false;
    for (let i = 0; i < promptSegments.length; i++) {
        let segment = promptSegments[i];
        for (let j = 0; j < segment.length; j++) {
            const word = segment[j];
            const bboxX = word.x;
            const bboxY = word.y;
            const bboxWidth = word.width;
            const bboxHeight = word.height;

            // All words have the same y bounding box, so return if y not in it
            if (y < bboxY - bboxHeight || bboxY < y) return;

            if (x <= bboxX + bboxWidth/2) {
                dividedSegment = i;
                dividingIndex = j;
                stop = true;
                break;
            } else {
                leftSegment.push(word);
            }
        }
        if (stop) break;
    }

    if (dividingIndex !== -1) {
        for (let i = dividedSegment; i < promptSegments.length; i++) {
            let segment = promptSegments[i];
            for (let j = dividingIndex; j < segment.length; j++) {
                const word = segment[j];
                rightSegment.push(word);
            }
            dividingIndex = 0;  // Only applies to divided segment; reset to 0
        }
    }

    promptSegments = [leftSegment, rightSegment];
}

function mergePromptSegments() {
    if (promptSegments.length < 2) return;
    promptSegments = [promptSegments[0].concat(promptSegments[1])];
}

function mergePromptSegmentsWithSelectedWord() {
    if (promptSegments.length !== 2) return;    // Word wasn't placed in box

    const word = availableWords[selectedWordIndex];
    const leftSegment = promptSegments[0];
    const rightSegment = promptSegments[1];
    if (leftSegment.length === 0) {
        leftSegment.push(word);
    } else if (rightSegment.length === 0) {
        rightSegment.push(word);
    } else {
        leftSegment.push(word);
    }

    availableWords.splice(selectedWordIndex, 1);
    mergePromptSegments();
    draw();
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
        divideToPromptSegments(startX, startY);
    } else {
        mergePromptSegments();
    }

    draw();
    startX = mouseX;
    startY = mouseY;
}

function onMouseUp() {
    if (selectedWordIndex >= 0) mergePromptSegmentsWithSelectedWord();
    selectedWordIndex = -1;
}

function onMouseOut() {
    if (selectedWordIndex >= 0) mergePromptSegmentsWithSelectedWord();
    selectedWordIndex = -1;
}

// Delete this once WebSpeech API is integrated
function getTestAvailableWords() {
    let word1 = {
        text: 'tacos',
        x: 100,
        y: 100,
        height: fontSize
    };
    word1.width = ctx.measureText(word1.text).width;
    availableWords.push(word1);

    let word2 = {
        text: 'arm swing',
        x: 250,
        y: 100,
        height: fontSize
    }
    word2.width = ctx.measureText(word2.text).width;
    availableWords.push(word2);
}

function getTestPrompt() {
    let word1 = { text: 'hello', height: fontSize };
    word1.width = ctx.measureText(word1.text).width;
    let word2 = { text: 'world', height: fontSize };
    word2.width = ctx.measureText(word2.text).width;

    let word3 = { text: 'javascript', height: fontSize };
    word3.width = ctx.measureText(word3.text).width;
    let word4 = { text: 'guilt', height: fontSize };
    word4.width = ctx.measureText(word4.text).width;

    //promptSegments.push([word1, word2]);
    //promptSegments.push([word3, word4]);
    promptSegments.push([word1, word2, word3, word4]);
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
            word.x += initialX + offset/2 * (i === 0 ? -1 : 1);
            word.y = initialY;
            ctx.fillText(word.text, word.x, word.y);
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
        const selectedWord = availableWords[selectedWordIndex];
        const offset = ctx.measureText(selectedWord.text).width + 8.335;
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
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    ctx.clearRect(0, 0, ww, wh);

    drawPrompt();
    drawAvailable();
}
