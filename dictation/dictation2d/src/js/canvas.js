let canvas = null;

main();

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function main() {
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    window.addEventListener('resize', onWindowResize);

    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(100, 50, 140, 74);
    ctx.stroke();
}
