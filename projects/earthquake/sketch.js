let table
let canvas
let taiwanMap
let mapScale
let mapRatio
let twData = []
let points = []
let waves = []
const waveDelta = 2000
const waveSpeed = 20
const waveCount = 5
const dayDelta = 500
let resetMillis = 0


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
    loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.csv", 'csv', 'header', d => dataTransform(d))
    setInterval(() => {
        loadTable("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.csv", 'csv', 'header', d => dataTransform(d))
        console.log('update data')
    }, 60000);
}

//filter out the earthquakes nearby Taiwan
function dataTransform (d) {
    //turn table in to arrays of object
    let arr = Object.values(d.getObject())
    twData = arr.filter(d => (d.latitude <= 26) && (d.latitude >= 21.5) && (d.longitude <= 122.5) && (d.longitude >= 119))
    resetTime()
}

//reset the wave objects every 30 days aka 15 seconds
function resetTime () {
    let time30Days = Date.now() - 2592000000
    waves = []
    twData.forEach(d => {
        let w = []
        for (let i = 0; i < waveCount; i++) {
            w.push((Date.parse(d.time) - time30Days) / 86400000 * dayDelta + millis() + waveDelta * i)
        }
        waves.push(w)
    })
}

function windowResized () {
    if (windowWidth / windowHeight > mapRatio) {
        mapScale = windowHeight / taiwanMap.height
    } else {
        mapScale = windowWidth / taiwanMap.width
    }
}

//lat to y and lon to x
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
    //draw map
    image(taiwanMap, (windowWidth - taiwanMap.width * mapScale) / 2, (windowHeight - taiwanMap.height * mapScale) / 2, taiwanMap.width * mapScale, taiwanMap.height * mapScale)
    //if data is loaded
    if (twData.length) {
        //for each wave object
        waves.forEach((w, i) => {
            let pos = geoToPixel(twData[i].latitude, twData[i].longitude)
            strokeWeight(pow(2, twData[i].mag) / 10)
            //draw the corresponding wave
            w.forEach(d => {
                if (millis() - d > 0) {
                    wave(pos.x, pos.y, (millis() - d) / waveDelta * waveSpeed)
                }
            })
        })
    }

    //show time
    let day = int((millis() - resetMillis) / dayDelta)
    stroke(0)
    strokeWeight(1)
    textSize(48)
    let date = new Date(Date.now() - (30 - day) * 86400000)
    text((date.getMonth() + 1) + '/' + date.getDate(), (windowWidth - taiwanMap.width * mapScale) / 2 + 100 * mapScale, (windowHeight - taiwanMap.height * mapScale) / 2 + 270 * mapScale)
    if (day == 30) {
        resetTime()
        resetMillis = millis()
    }
}

let pointPerRing = 75
function wave (x, y, dis) {
    dis = dis % (waveSpeed * waveCount)
    let ringCount = (int(dis / waveSpeed) + 1) / 2
    stroke(255, 0, 255 - 255 / ringCount)
    for (let i = 0; i < pointPerRing; i++) {
        let angle = (TWO_PI / pointPerRing) * i - PI
        point(x + cos(angle) * dis, y + sin(angle) * dis)
    }
}
