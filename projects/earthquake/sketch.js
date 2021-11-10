let table
let canvas
let taiwanMap
let mapScale
let mapRatio
let twData = []
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
    image(taiwanMap, (windowWidth - taiwanMap.width * mapScale) / 2, (windowHeight - taiwanMap.height * mapScale) / 2, taiwanMap.width * mapScale, taiwanMap.height * mapScale)
    let taipei = geoToPixel(23.9934, 120.7235)
    twData.forEach(d => {
        let pos = geoToPixel(d.latitude, d.longitude)
        fill(255, 0, 0)
        noStroke()
        ellipse(pos.x, pos.y, d.mag * 5)
    })
}
