let trackingList = ["BTC", "ETH", "BNB", "SOL", "ADA",
    "XRP", "DOT", "DOGE", "SHIB", "AVAX"]
let logos = []

let topCoinsPastData = []
let lastResetData = []
let initData = true
let lastTime = 0

let endX
let startY = []
let rectWidth
let rectHeight
let axisWidth
let axisHeight

let maxData = 120

function preload () {
    trackingList.forEach((d, i) => {
        logos[i] = loadImage(`./${d}.png`);
    })
}

function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    noStroke()

    init()

    setInterval(getData, 1000)
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    init()
}

//init dimention related variables
function init () {
    endX = windowWidth / 12 + windowWidth * 5 / 6
    rectWidth = 30 / pixelDensity()
    rectHeight = windowHeight / 30 * 2
    for (let i = 0; i < 10; i++) {
        startY[i] = windowHeight / 6 + windowHeight / 30 * 2 * i
    }
    axisWidth = 5 / pixelDensity()
    axisHeight = windowHeight / 30

    maxData = ((windowWidth * 5 / 6 / (30 / pixelDensity())) / 10 + 1) * 10
}
//fetch data from binance's api
function getData () {
    let date = Date.now()
    httpGet('https://api.binance.com/api/v3/ticker/price', 'json', res => {
        let topCoinsData = []
        trackingList.forEach((d, i) => {
            topCoinsData[i] = res.find(c => c.symbol == trackingList[i] + 'USDT')
        })
        if (initData) {
            lastResetData = topCoinsData
            initData = false
        }
        if (topCoinsPastData.length >= maxData) {
            topCoinsPastData.shift()
        }
        console.log(date)
        topCoinsPastData.push({ data: topCoinsData, reset: lastResetData, time: date })
    })
}

function draw () {
    background(0)
    //I designed the if condition to be like this to make sure no matter how long the software runs, it will always update when the minute changes
    if (Date.now() % 60000 <= 1000 && Date.now() - lastTime > 50000) {
        lastResetData = topCoinsPastData[topCoinsPastData.length - 1].data
        lastTime = Date.now()
    }
    //draw the rects
    if (topCoinsPastData.length > 2 && lastResetData.length != 0) {
        for (let i = topCoinsPastData.length - 1; i > 0; i--) {
            let coins = topCoinsPastData[i].data
            let reset = topCoinsPastData[i].reset
            coins.forEach((d, j) => {
                let diff = constrain((d.price - reset[j].price) / reset[j].price * 100, -0.5, 0.5)
                let c = d3.color(d3.interpolateRdYlGn(diff + 0.5))
                fill(c.rgb().r, c.rgb().g, c.rgb().b)
                rect(endX - (topCoinsPastData.length - i) * rectWidth, startY[j], rectWidth, rectHeight)
            });
            if (topCoinsPastData[i].time % 5000 < 1000) {
                fill(255)
                rect(endX - (topCoinsPastData.length - i - 1) * rectWidth - axisWidth / 2, windowHeight / 6 * 5 + axisHeight / 4, axisWidth, axisHeight / 2)
            }
            if (topCoinsPastData[i].time % 10000 < 1000) {
                fill(255)
                rect(endX - (topCoinsPastData.length - i - 1) * rectWidth - axisWidth, windowHeight / 6 * 5 + axisHeight / 4, axisWidth * 2, axisHeight)
            }
        }
    }
    //draw logos
    if (mouseX > windowWidth / 12 && mouseX < windowWidth * 11 / 12) {
        let y = int((mouseY - windowHeight / 6) / (windowHeight / 30 * 2))
        if (y >= 0 && y < 10) {
            image(logos[y], mouseX, mouseY)
        }
    }

    fill(0)
    rect(0, 0, windowWidth / 12, windowHeight)
}