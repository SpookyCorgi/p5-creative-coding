let table
let canvas
let taiwanMap
let mapScale
let mapRatio
let twData = []
let points = []
let waves = []
const waveDelta = 4000
const waveSpeed = 16
const waveCount = 5
const maxWaveRadius = 100

function preload () {
    //https://simplemaps.com/resources/svg-tw
    //edit by myself to make it larger and easier to calculate longitude and latitude
    taiwanMap = loadImage('tw.png', d => {
        mapRatio = d.width / d.height
    })
}

function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    ellipseMode(CENTER)

    //calculate scale
    if (windowWidth / windowHeight > mapRatio) {
        mapScale = windowHeight / taiwanMap.height
    } else {
        mapScale = windowWidth / taiwanMap.width
    }

    //loadData
    loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.csv", 'csv', 'header', d => {
        //turn table in to arrays of object
        let arr = Object.values(d.getObject())
        twData = arr.filter(d => (d.latitude <= 26) && (d.latitude >= 21.5) && (d.longitude <= 122.5) && (d.longitude >= 119))
        twData.forEach(d => {
            let w = []
            for (let i = 0; i < waveCount; i++) {
                w.push(millis() + waveDelta * i)
            }
            waves.push(w)
        })

    })
    setInterval(() => {
        loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.csv", 'csv', 'header', d => {
            //turn table in to arrays of object
            let arr = Object.values(d.getObject())
            twData = arr.filter(d => (d.latitude <= 26) && (d.latitude >= 21.5) && (d.longitude <= 122.5) && (d.longitude >= 119))
        })
        console.log('update data')
    }, 60000);
}

function windowResized () {
    if (windowWidth / windowHeight > mapRatio) {
        mapScale = windowHeight / taiwanMap.height
    } else {
        mapScale = windowWidth / taiwanMap.width
    }
}

function geoToPixel (lat, lon) {
    //119~122.5   924px
    //21.5~26 1317px
    let xStart = (windowWidth - taiwanMap.width * mapScale) / 2
    let yStart = (windowHeight - taiwanMap.height * mapScale) / 2
    let lonScale = 924 / (122.5 - 119)
    let latScale = 1317 / (26 - 21.5)
    let resultX = (lon - 119) * lonScale * mapScale + xStart
    let resultY = (26 - lat) * latScale * mapScale + yStart
    return ({ x: resultX, y: resultY })
}

function draw () {
    background(255)
    image(taiwanMap, (windowWidth - taiwanMap.width * mapScale) / 2, (windowHeight - taiwanMap.height * mapScale) / 2, taiwanMap.width * mapScale, taiwanMap.height * mapScale)
    waves.forEach((w, i) => {
        let pos = geoToPixel(twData[i].latitude, twData[i].longitude)
        w.forEach(d => {
            stroke(0)
            if (millis() - d > 0) {
                wave(pos.x, pos.y, (millis() - d) / waveDelta * waveSpeed)
            }
        })
    })
}

let pointPerRing = 50
function wave (x, y, dis) {
    dis = dis % maxWaveRadius
    for (let i = 0; i < pointPerRing; i++) {
        let angle = (TWO_PI / pointPerRing) * i - PI
        point(x + cos(angle) * dis, y + sin(angle) * dis)
    }
}
