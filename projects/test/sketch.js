//mta use some ugly data structure google developed
//I spend hours trying to decode it without nodejs libraries,(static webpage) but in vain
//so I'm using an api provided by other developer which they already convert the protobuf to json
let stationNames

function preload () {
    httpGet('https://mtaapi.herokuapp.com/stations', 'json', res => {
        stationNames = res.result
        console.log(stationNames)
        stationNames.forEach(d => {
            if (d.name.includes('Jay')) {
                console.log(d)
            }
        })
    })

}

function setup () {
    canvas = createCanvas(windowWidth, windowHeight)
    canvas.position(0, 0)
    canvas.style('z-index', '-1')
    rectMode(CENTER)
    noLoop()
}

function draw () {
    background(255)
}