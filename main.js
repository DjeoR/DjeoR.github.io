let gridData;
let newGridData;

let settings = {
    DENSITY: 0,
    SIZE: 0,
    SPEED: 0,
    RADIUS: 0,
    TYPE: "circle",
    LIVEFROM: 0,
    LIVETO: 0,
    SPAWNFROM: 0,
    SPAWNTO: 0
}

let playing = false;
let stepID;

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

updateSettings();
randomGrid();
draw();

function randomGrid() {

    settings.SIZE = Number(document.getElementById("size").value);

    gridData = new Array(settings.SIZE);

    for (let i = 0; i < settings.SIZE; i++) {
        gridData[i] = new Array(settings.SIZE);

        for (let j = 0; j < settings.SIZE; j++) {
            gridData[i][j] = 100 * Math.random() > settings.DENSITY ? 0 : 1;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < settings.SIZE; i++) {
        for (let j = 0; j < settings.SIZE; j++) {
            ctx.fillStyle = gridData[i][j] == 1 ? "lightgray" : "black";
            ctx.fillRect(i * 600 / settings.SIZE, j * 600 / settings.SIZE, 600 / settings.SIZE, 600 / settings.SIZE);
        }
    }
}

function updateSettings() {

    pause();

    settings.DENSITY = Number(document.getElementById("density").value);
    settings.TYPE = document.getElementById("k1type").checked ? "circle" : "square";
    settings.RADIUS = Number(document.getElementById("k1radius").value);
    settings.LIVEFROM = Number(document.getElementById("k1livefrom").value);
    settings.LIVETO = Number(document.getElementById("k1liveto").value);
    settings.SPAWNFROM = Number(document.getElementById("k1spawnfrom").value);
    settings.SPAWNTO = Number(document.getElementById("k1spawnto").value);

    document.getElementById("densitydisplay").innerText = settings.DENSITY + "%";
    document.getElementById("sizedisplay").innerText = document.getElementById("size").value + "px";
    document.getElementById("speeddisplay").innerText = Math.round(1000 / (1010 - 10 * settings.SPEED)) + "fps";
    document.getElementById("k1radiusdisplay").innerText = settings.RADIUS + "px";
}

function updateSpeed() {
    settings.SPEED = 1010 - 10 * Number(document.getElementById("speed").value);
    document.getElementById("speeddisplay").innerText = Math.round(1000 / settings.SPEED) + "fps";
}

function reset() {
    pause()
    randomGrid();
    draw();
}

function step() {

    newGridData = new Array(settings.SIZE);

    for (let i = 0; i < settings.SIZE; i++) {
        newGridData[i] = new Array(settings.SIZE);

        for (let j = 0; j < settings.SIZE; j++) {
            updateCell(i, j);
        }
    }

    gridData = newGridData;
    draw();
}

function updateCell(x, y) {
    
    let count = getKernelCellCount(x, y, settings.RADIUS, settings.TYPE);
    if (count < settings.LIVEFROM || count > settings.LIVETO) {
        newGridData[x][y] = 0;
    } else if (count >= settings.SPAWNFROM && count <= settings.SPAWNTO) {
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
    return (value + settings.SIZE) % settings.SIZE;
}

function playPause() {
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
        setTimeout(step_repeating, settings.SPEED);
        step();
    }
}