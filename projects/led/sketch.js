let scale
let ledSize
let colors = []

let mode = 'arduino'
let r = 0

let serial; // variable for the serial object
let latestData = "waiting for data"; // variable to hold the data

let leds = {
    vertices: [
        0, 1, 0,
        -0.525731086730957, 0.8506507873535156, 0,
        -0.30901700258255005, 0.80901700258255, 0.5,
        0.30901700258255005, 0.80901700258255, 0.5,
        0.525731086730957, 0.8506507873535156, 0,
        0.30901700258255005, 0.80901700258255, -0.5,
        -0.30901700258255005, 0.80901700258255, -0.5,
        -0.80901700258255, 0.5, -0.30901700258255005,
        -0.80901700258255, 0.5, 0.30901700258255005,
        -0.5, 0.30901700258255005, 0.80901700258255,
        0, 0.525731086730957, 0.8506507873535156,
        0.5, 0.30901700258255005, 0.80901700258255,
        0.80901700258255, 0.5, 0.30901700258255005,
        0.80901700258255, 0.5, -0.30901700258255005,
        0.5, 0.30901700258255005, -0.80901700258255,
        0, 0.525731086730957, -0.8506507873535156,
        -0.5, 0.30901700258255005, -0.80901700258255,
        -0.8506507873535156, 0, -0.525731086730957,
        -1, 0, 0,
        -0.8506507873535156, 0, 0.525731086730957,
        -0.5, -0.30901700258255005, 0.80901700258255,
        0, 0, 1,
        0.5, -0.30901700258255005, 0.80901700258255,
        0.8506507873535156, 0, 0.525731086730957,
        1, 0, 0,
        0.8506507873535156, 0, -0.525731086730957,
        0.5, -0.30901700258255005, -0.80901700258255,
        0, 0, -1,
        -0.5, -0.30901700258255005, -0.80901700258255,
        -0.80901700258255, -0.5, -0.30901700258255005,
        -0.80901700258255, -0.5, 0.30901700258255005,
        -0.30901700258255005, -0.80901700258255, 0.5,
        0, -0.525731086730957, 0.8506507873535156,
        0.30901700258255005, -0.80901700258255, 0.5,
        0.80901700258255, -0.5, 0.30901700258255005,
        0.80901700258255, -0.5, -0.30901700258255005,
        0.30901700258255005, -0.80901700258255, -0.5,
        0, -0.525731086730957, -0.8506507873535156,
        -0.30901700258255005, -0.80901700258255, -0.5,
        -0.525731086730957, -0.8506507873535156, 0,
        0, -1, 0,
        0.525731086730957, -0.8506507873535156, 0,
    ]
}

function setup () {
    if (windowWidth >= 992) {
        canvas = createCanvas(windowWidth * 0.3, windowWidth * 0.3, WEBGL)
    } else {
        canvas = createCanvas(windowWidth * 0.8, windowWidth * 0.8, WEBGL)
    }

    canvas.position(0, 0)
    canvas.class('w-30-xl')
    canvas.parent('#canvas-container')

    //init sphere and scale
    //the icosphere is generated using this function and then manually sorted for future physical device
    //leds = icosphere((order = 1), (uvMap = false));
    scale = width / 3
    ledSize = width / 200


    angleMode(DEGREES);
    //init color
    for (let i = 0; i < 42; i++) {
        colors[i] = color(100, random(150, 255), random(150, 255))
    }

    // serial constructor
    serial = new p5.SerialPort()
    // get a list of all connected serial devices
    serial.list()
    // serial port to use - you'll need to change this
    serial.open('/dev/tty.usbmodem14501')
    // callback for when the sketchs connects to the server
    serial.on('connected', serverConnected)
    // callback to print the list of serial devices
    serial.on('list', gotList)
    // what to do when we get serial data
    serial.on('data', gotData)
    // what to do when there's an error
    serial.on('error', gotError)
    // when to do when the serial port opens
    serial.on('open', gotOpen)
    // what to do when the port closes
    serial.on('close', gotClose)
}

function windowResized () {
    if (windowWidth >= 992) {
        resizeCanvas(windowWidth * 0.3, windowWidth * 0.3, WEBGL)
    } else {
        resizeCanvas(windowWidth * 0.3, windowWidth * 0.3, WEBGL)
    }
    scale = width / 3
    ledSize = width / 200
}


let currentLed = 0
function mouseClicked () {
    currentLed++
    if (currentLed == 42) {
        currentLed = 0
    }
}

function draw () {
    if (latestData == 'waiting for data' || latestData == 'Serial Port is Closed') {
        mode = 'auto'
    } else {
        mode = 'arduino'
    }
    let arr = latestData.split(" ");

    background(0);

    if (mode == 'arduino') {
        rotateY(parseFloat(arr[0]) + 180)
        rotateZ(parseFloat(arr[2]))
        rotateX(parseFloat(arr[1]))
        strokeWeight(2)
        stroke(255)
        fill(50, 150, 150)
        box(0.5 * scale, 0.1 * scale, 0.3 * scale)
    } else {
        r += 0.1
        rotateY(r)
        rotateZ(1.5 * r)
        rotateX(2 * r)
    }

    for (let i = 0; i < 42; i++) {
        push();
        let x = leds.vertices[i * 3] * scale
        let y = leds.vertices[i * 3 + 1] * scale
        let z = leds.vertices[i * 3 + 2] * scale
        translate(x, y, z);
        fill(colors[i]);
        stroke(colors[i]);
        let newPos;
        if (mode == 'arduino') {
            newPos = getRotatedPostion(arr[0], arr[1], arr[2], x, y, z)
        } else {
            newPos = getRotatedPostion(r, 2 * r, 1.5 * r, x, y, z)
        }
        if (newPos[1] >= 0.2 * scale) {
            fill(255, 0, 0)
            stroke(255, 0, 0)
        }
        sphere(ledSize, 12, 9);
        pop();

        if (i < 41) {
            strokeWeight(0.2)
            stroke(255);
            line(leds.vertices[i * 3] * scale, leds.vertices[i * 3 + 1] * scale, leds.vertices[i * 3 + 2] * scale,
                leds.vertices[(i + 1) * 3] * scale, leds.vertices[(i + 1) * 3 + 1] * scale, leds.vertices[(i + 1) * 3 + 2] * scale)
        }
    }
}

//helper function for rotation transform
function getRotatedPostion (yaw, pitch, row, x, y, z) {
    let newX = x
    let newY = y
    let newZ = z
    let tmpX, tmpY, tmpZ

    tmpY = newY * cos(pitch) - newZ * sin(pitch)
    tmpZ = newY * sin(pitch) + newZ * cos(pitch)
    newZ = tmpZ
    newY = tmpY

    tmpX = newX * cos(row) - newY * sin(row)
    tmpY = newX * sin(row) + newY * cos(row)
    newX = tmpX
    newY = tmpY

    tmpZ = newZ * cos(yaw) - newX * sin(yaw)
    tmpX = newZ * sin(yaw) + newX * cos(yaw)
    newX = tmpX
    newZ = tmpZ

    return [newX, newY, newZ]
}


//code from scott

function serverConnected () {
    console.log("Connected to Server");
}

// list the ports
function gotList (thelist) {
    console.log("List of Serial Ports:");

    for (let i = 0; i < thelist.length; i++) {
        console.log(i + " " + thelist[i]);
    }
}

function gotOpen () {
    console.log("Serial Port is Open");
}

function gotClose () {
    console.log("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

function gotError (theerror) {
    console.log(theerror);
}

// when data is received in the serial buffer

function gotData () {
    let currentString = serial.readLine(); // store the data in a variable
    trim(currentString); // get rid of whitespace
    if (!currentString) return; // if there's nothing in there, ignore it
    console.log(currentString); // print it out
    latestData = currentString; // save it to the global variable
}


//code from https://observablehq.com/@mourner/fast-icosphere-mesh
icosphere = (order = 0) => {
    // set up a 20-triangle icosahedron
    const f = (1 + 5 ** 0.5) / 2;
    const T = 4 ** order;

    const vertices = new Float32Array((10 * T + 2) * 3);
    vertices.set(Float32Array.of(
        -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f, 0,
        0, -1, f, 0, 1, f, 0, -1, -f, 0, 1, -f,
        f, 0, -1, f, 0, 1, -f, 0, -1, -f, 0, 1));
    let triangles = Uint32Array.of(
        0, 11, 5,
        0, 5, 1,
        0, 1, 7,
        0, 7, 10,
        0, 10, 11,
        11, 10, 2,
        5, 11, 4,
        1, 5, 9,
        7, 1, 8,
        10, 7, 6,
        3, 9, 4,
        3, 4, 2,
        3, 2, 6,
        3, 6, 8,
        3, 8, 9,
        9, 8, 1,
        4, 9, 5,
        2, 4, 11,
        6, 2, 10,
        8, 6, 7);

    let v = 12;
    const midCache = order ? new Map() : null; // midpoint vertices cache to avoid duplicating shared vertices

    function addMidPoint (a, b) {
        const key = Math.floor((a + b) * (a + b + 1) / 2) + Math.min(a, b); // Cantor's pairing function
        let i = midCache.get(key);
        if (i !== undefined) { midCache.delete(key); return i; }
        midCache.set(key, v);
        for (let k = 0; k < 3; k++) vertices[3 * v + k] = (vertices[3 * a + k] + vertices[3 * b + k]) / 2;
        i = v++;
        return i;
    }

    let trianglesPrev = triangles;
    for (let i = 0; i < order; i++) {
        // subdivide each triangle into 4 triangles
        triangles = new Uint32Array(trianglesPrev.length * 4);
        for (let k = 0; k < trianglesPrev.length; k += 3) {
            const v1 = trianglesPrev[k + 0];
            const v2 = trianglesPrev[k + 1];
            const v3 = trianglesPrev[k + 2];
            const a = addMidPoint(v1, v2);
            const b = addMidPoint(v2, v3);
            const c = addMidPoint(v3, v1);
            let t = k * 4;
            triangles[t++] = v1; triangles[t++] = a; triangles[t++] = c;
            triangles[t++] = v2; triangles[t++] = b; triangles[t++] = a;
            triangles[t++] = v3; triangles[t++] = c; triangles[t++] = b;
            triangles[t++] = a; triangles[t++] = b; triangles[t++] = c;
        }
        trianglesPrev = triangles;
    }
    // normalize vertices
    for (let i = 0; i < vertices.length; i += 3) {
        const m = 1 / Math.hypot(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
        vertices[i + 0] *= m;
        vertices[i + 1] *= m;
        vertices[i + 2] *= m;
    }
    return { vertices, triangles };
}