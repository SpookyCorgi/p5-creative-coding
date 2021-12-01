let leds
let scale
function setup () {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')

    leds = icosphere((order = 1), (uvMap = false));
    scale = windowWidth / 5
    angleMode(DEGREES);
}

let currentLed = 0
function mouseClicked () {
    currentLed++
    if (currentLed == 42) {
        currentLed = 0
    }
}

let r = 0;
function draw () {
    background(0);
    r += 0.2

    rotateZ(2 * r)
    rotateY(1.5 * r)
    rotateX(r)

    //rotateX(2 * r)

    //
    for (let i = 0; i < 42; i++) {
        push();
        let x = leds.vertices[i * 3] * scale
        let y = leds.vertices[i * 3 + 1] * scale
        let z = leds.vertices[i * 3 + 2] * scale
        translate(
            x,
            y,
            z
        );
        fill(i / 42 * 255, (42 - i) / 42 * 255, 255);
        stroke(i / 42 * 255, (42 - i) / 42 * 255, 255);
        let newPos = getRotatedPostion(r, 1.5 * r, 2 * r, x, y, z)
        if (newPos[1] >= 0) {
            fill(255, 0, 0)
            stroke(255, 0, 0)
        }
        sphere(10, 12, 9);
        pop();
    }
}

function getRotatedPostion (row, yaw, pitch, x, y, z) {
    let newX = x
    let newY = y
    let newZ = z
    let tmpX, tmpY, tmpZ
    tmpY = newY * cos(row) - newZ * sin(row)
    tmpZ = newY * sin(row) + newZ * cos(row)
    newZ = tmpZ
    newY = tmpY

    tmpZ = newZ * cos(yaw) - newX * sin(yaw)
    tmpX = newZ * sin(yaw) + newX * cos(yaw)
    newX = tmpX
    newZ = tmpZ

    tmpX = newX * cos(pitch) - newY * sin(pitch)
    tmpY = newX * sin(pitch) + newY * cos(pitch)
    newX = tmpX
    newY = tmpY

    return [newX, newY, newZ]
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
    /*let triangles = Uint32Array.of(
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
        11, 10, 2, 5, 11, 4, 1, 5, 9, 7, 1, 8, 10, 7, 6,
        3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        9, 8, 1, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7);*/
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