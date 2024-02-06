let SIZE;
let CELL_SIZE;
let RADIUS = 3;
let TYPE = "circle";
let ALIVEFROM;
let ALIVETO;
let SPAWNFROM;
let SPAWNTO;
let gridData;
let newGridData;

let playing = false;
let stepID;

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

console.log(canvas);

randomGrid();
draw();
ctx.fillRect(10, 10, 10, 10);

function randomGrid() {

    SIZE = Number(document.getElementById("size").value);
    CELL_SIZE = 600 / SIZE;

    gridData = new Array(SIZE);

    for (let i = 0; i < SIZE; i++) {
        gridData[i] = new Array(SIZE);

        for (let j = 0; j < SIZE; j++) {
            gridData[i][j] = Math.random() > 0.5 ? 0 : 1;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            ctx.fillStyle = gridData[i][j] == 1 ? "lightgray" : "black";
            ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }
}

function reset() {
    pause()
    randomGrid();
    draw();
}

function step() {

    newGridData = new Array(SIZE);

    console.log(document.getElementById("kernel1radius").value);
    RADIUS = Number(document.getElementById("kernel1radius").value);
    TYPE = document.getElementById("kernel1circle").checked ? "circle" : "square";
    ALIVEFROM = Number(document.getElementById("kernel1alivefrom").value);
    ALIVETO = Number(document.getElementById("kernel1aliveto").value);
    SPAWNFROM = Number(document.getElementById("kernel1spawnfrom").value);
    SPAWNTO = Number(document.getElementById("kernel1spawnto").value);

    console.log(RADIUS);

    for (let i = 0; i < SIZE; i++) {
        newGridData[i] = new Array(SIZE);

        for (let j = 0; j < SIZE; j++) {
            updateCell(i, j);
        }
    }

    gridData = newGridData;
    draw();
}

function updateCell(x, y) {
    
    let count = getKernelCellCount(x, y, RADIUS, TYPE);
    if (count < ALIVEFROM || count > ALIVETO) {
        newGridData[x][y] = 0;
    } else if (count >= SPAWNFROM && count <= SPAWNTO) {
        newGridData[x][y] = 1;
    } else {
        newGridData[x][y] = gridData[x][y];
    }
}

function getKernelCellCount(x, y, radius, type) {
    let currentCellKernelCount = 0;

    if (type == "circle") {
        for (let i = - radius; i <= radius; i++) {
            let dy = Math.floor(Math.sqrt(radius * radius - i * i));
            for (let j = - dy; j <= dy; j++) {
                if (gridData[wrap(i + x)][wrap(j + y)] == 1 && !(0 == i && 0 == j)) {
                    currentCellKernelCount++;
                }
            }
        }
    } else {
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                if (gridData[wrap(i)][wrap(j)] == 1 && !(x == i && y == j)) {
                    currentCellKernelCount++;
                }
            }
        }
    }

    return currentCellKernelCount;
}

function wrap(value) {
    return (value + SIZE) % SIZE;
}

function play_pause() {
    if (!playing) {
        play();
    } else {
        pause();
    }
}

function play() {
    document.getElementById("play-pause").innerText = "PAUSE";
    playing = true;
    step_repeating();
}

function pause() {
    document.getElementById("play-pause").innerText = "PLAY";
    playing = false;
}

function step_repeating() {
    if (playing) {
        setTimeout(step_repeating, 500 - (document.getElementById("speed").value * 4.95));
        step();
    }
}