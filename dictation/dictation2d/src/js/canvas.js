import clearIconImagePath from '../assets/icons/clear.png';
import searchIconImagePath from '../assets/icons/search.png';
import voiceIconImagePath from '../assets/icons/voice.png';

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

let currentlyRecording = false;
let speechRecognition = null;

let clearIcon;
let searchIcon;
let voiceIcon;
let clearIconLoaded = false;
let searchIconLoaded = false;
let voiceIconLoaded = false;

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

function getIconBoundingBoxes() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const dims = getPromptBoxBoundingBox();

    const clearIconLength = 20;
    const clearIconX = ww/2 + dims.width/2 - 7*clearIconLength;
    const clearIconY = wh/2 - clearIconLength/2;

    const searchIconLength = 24;
    const searchIconX = ww/2 + dims.width/2 - 2*searchIconLength;
    const searchIconY = wh/2 - searchIconLength/2;

    const voiceIconLength = 25;
    const voiceIconX = ww/2 + dims.width/2 - 3.5*voiceIconLength;
    const voiceIconY = wh/2 - voiceIconLength/2;

    return {
        clear: { x: clearIconX, y: clearIconY, len: clearIconLength },
        search: { x: searchIconX, y: searchIconY, len: searchIconLength },
        voice: { x: voiceIconX, y: voiceIconY, len: voiceIconLength },
    }
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

function clearPrompt() {
    selectedWordIndex = -1;
    availableWords = [];
    promptSegments = [];
    draw();
}

function initDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.lang = 'en-US';
    speechRecognition.interimResults = true;
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onresult = (event) => {
        const utteranceList = event.results;
        const latestUtterance = utteranceList[utteranceList.length-1];
        const speechRecognition = latestUtterance[latestUtterance.length-1];
        const transcript = speechRecognition.transcript.toLowerCase();
        if (latestUtterance.isFinal) {
            const words = transcript.split(' ');
            const x = (window.innerWidth/2)*Math.random() + window.innerWidth/8;
            const y = (window.innerHeight/3)*Math.random() + window.innerWidth/10;
            for (let i = 0; i < words.length; i++) {
                const word = {
                    text: words[i],
                    x: x + 100*i,
                    y: y,
                    height: fontSize
                };
                word.width = ctx.measureText(word.text).width;
                availableWords.push(word);
            }
            draw();
            console.log(transcript);
        }
    }
}

function startDictation() {
    speechRecognition.start();
}

function stopDictation() {
    speechRecognition.stop();
}

function searchPrompt() {
    if (promptSegments.length > 1) console.log('Internal error: prompt merging failed');
    if (promptSegments.length === 0) return;

    let finalPrompt = '';
    for (const word in promptSegments[0]) {
        finalPrompt += promptSegments[0][word].text + '+';
    }

    window.open('https://www.google.com/search?q=' + finalPrompt, '_blank');
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

    if (promptSegments.length > 1) console.error('Internal error: prompt merging failed.');
    if (promptSegments.length !== 0) {
        for (let i = 0; i < promptSegments[0].length; i++) {
            let word = promptSegments[0][i];
            if (hitTestText(startX, startY, word)) {
                availableWords.push(word);
                selectedWordIndex = availableWords.length - 1;
                promptSegments[0].splice(i, 1);
            }
        }
    }

    const idims = getIconBoundingBoxes();
    for (const icon in idims) {
        const x = idims[icon].x;
        const y = idims[icon].y;
        const len = idims[icon].len;
        if (hitTestShape(startX, startY, x, y, len, len)) {
            switch (icon) {
                case 'clear':
                    clearPrompt();
                    break;
                case 'voice':
                    currentlyRecording = !currentlyRecording;
                    drawCurrentlyRecording();
                    if (currentlyRecording) startDictation();
                    else stopDictation();
                    break;
                case 'search':
                    searchPrompt();
                    break;
            }
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
    let word4 = { text: 'waves', height: fontSize };
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

    initDictation();

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
    const initialX = ww/2 - cumulativeWidth/2 - 50; // 50px offset for icons
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

// Draws red circle on top of voice icon indicating if currently recording.
function drawCurrentlyRecording() {
    const idims = getIconBoundingBoxes();
    const radius = 5;

    if (currentlyRecording) {
        ctx.strokeStyle = '#ff0000';
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(idims.voice.x + idims.voice.len/2, idims.voice.y - idims.voice.len/2, radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();

        // Reset colors to black
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
    } else {
        ctx.clearRect(idims.voice.x + idims.voice.len/2 - 1.5*radius, idims.voice.y - idims.voice.len/2 - 1.5*radius, 3*radius, 3*radius);
    }
}

function drawPromptBox() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const dims = getPromptBoxBoundingBox();
    const idims = getIconBoundingBoxes();

    // Prompt box outline
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(dims.x, dims.y, dims.width, dims.height, [20]);
    ctx.stroke();

    // Clear icon (an X symbol)
    if (clearIconLoaded) {
        ctx.drawImage(clearIcon, idims.clear.x, idims.clear.y, idims.clear.len, idims.clear.len);
    } else {
        clearIcon = new Image();
        clearIcon.src = clearIconImagePath;
        clearIcon.onload = () => {
            clearIconLoaded = true;
            ctx.drawImage(clearIcon, idims.clear.x, idims.clear.y, idims.clear.len, idims.clear.len);
        }
    }

    // Divider separating clear icon with other icons
    ctx.strokeStyle = '#6c6c6c';
    ctx.beginPath();
    ctx.moveTo(ww/2 + dims.width/2 - 100, wh/2 - (dims.height/2 - 25));
    ctx.lineTo(ww/2 + dims.width/2 - 100, wh/2 + (dims.height/2 - 25));
    ctx.closePath();
    ctx.stroke();

    // Voice icon (microphone symbol)
    if (voiceIconLoaded) {
        ctx.drawImage(voiceIcon, idims.voice.x, idims.voice.y, idims.voice.len, idims.voice.len);
    } else {
        voiceIcon = new Image();
        voiceIcon.src = voiceIconImagePath;
        voiceIcon.onload = () => {
            voiceIconLoaded = true;
            ctx.drawImage(voiceIcon, idims.voice.x, idims.voice.y, idims.voice.len, idims.voice.len);
        }
    }

    // Draw red circle if currently recording
    drawCurrentlyRecording();

    // Search icon (looking glass symbol)
    if (searchIconLoaded) {
        ctx.drawImage(searchIcon, idims.search.x, idims.search.y, idims.search.len, idims.search.len);
    } else {
        searchIcon = new Image();
        searchIcon.src = searchIconImagePath;
        searchIcon.onload = () => {
            searchIconLoaded = true;
            ctx.drawImage(searchIcon, idims.search.x, idims.search.y, idims.search.len, idims.search.len);
        }
    }
}

function drawPrompt() {
    drawPromptBox();

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
