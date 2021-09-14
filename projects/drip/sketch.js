let dripInterval = 0 //interval of each drip
let lastDripTime = 0 //last drip time for the timer
let dripQueue = [] //queue storing drips
const gravity = 0.00098 //gravity const for the drips

function setup () {
  //init canvas variables in setup
  createCanvas(windowWidth, windowHeight);
  noFill()
  stroke(255)
}

function draw () {
  background(0);
  if (millis() - lastDripTime > dripInterval) {//timer
    let drip = new Drip() //new drip!
    dripQueue.push(drip) //store the drip in the queue
    dripInterval = random(1000, 5000) //create a random time interval for the next drip!
    lastDripTime = millis()//store time for the timer
  }
  dripQueue.forEach((d, i) => {
    if (d.state === "dead") {
      dripQueue.splice(i, 1);//remove the dead drips from the queue, always important to do memory management
    }
    d.display()//draw the drips!
  })
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight)//resize canvas when window is resized
}

//the ripple class!
class Ripple {
  x = 0
  y = 0
  w = 0
  h = 0
  wSpeed = 2
  hSpeed = 0.5
  strokeColor = 255
  state = "growing"

  constructor(x, y, w, h) {
    //initialize the variables for the ellipse
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  display () {
    this.w += this.wSpeed //increase the width of the ellipse
    this.h += this.hSpeed //increase the height of the ellipse
    this.strokeColor-- //decrease the color of the ellipse
    if (this.strokeColor <= 0) {
      this.state = "dead" //if the color reaches 0, change state to dead
    }

    if (this.state === "growing") {// if the state is growing draw the ripple!
      stroke(this.strokeColor)
      ellipse(this.x, this.y, this.w, this.h)
    }
  }
}

class Drip {
  x = 0
  y = 0
  initY = 50
  wSize = 0
  hSize = 0
  maxSize = random(30, 150)
  state = "growing"
  dropTime = 0
  growSpeed = 1.5
  lastRippleTime = 0
  rippleTime = 1000
  rippleQueue = []
  rippleAmount = 0
  shrinkSpeed = 2

  constructor(x = random(this.maxSize / 2, windowWidth - this.maxSize / 2), y = this.initY) {//init x according to drip size
    this.x = x
    this.y = y
  }

  grow () {
    if (this.wSize < this.maxSize) {//increase the circle until it reaches maxsize
      this.wSize += this.growSpeed
      this.hSize += this.growSpeed
    } else if (this.state === "growing") {
      this.state = "dropping"//if reached max size starts dropping
      this.dropTime = millis()
    }
  }

  display () {
    this.grow()

    if (this.state === "dropping") {
      this.hSize++
      this.y = this.initY + gravity * (millis() - this.dropTime) * (millis() - this.dropTime)//calculate position according to gravity
      if (this.y > windowHeight - 100 - this.maxSize / 2) {
        this.state = "dropped"//if reach the bottom change state to dropped
      }
    }

    if (this.state === "dropped" && this.rippleAmount <= (this.maxSize / 50)) {//if state is dropped and amount of ripple is smaller than the suppose amount
      if ((millis() - this.lastRippleTime) > this.rippleTime) {//ripple timer
        this.lastRippleTime = millis()
        let ripple = new Ripple(this.x, this.y, this.wSize, this.wSize)//create new ripple, purposely use wSize on both width and height otherwise it'll look weird
        this.rippleQueue.push(ripple)//push the new ripple to queue
        this.rippleAmount++//counting
      }
    }

    if (this.state == "growing" || this.state == "dropping") {
      stroke(255)
      ellipse(this.x, this.y, this.wSize, this.hSize)//draw ellipse at appropiate states
    }

    this.rippleQueue.forEach((d, i) => {
      d.display()//draw all ripple
      if (d.state === "dead") {
        this.rippleQueue.splice(i, 1)//if ripple is dead, remove it from queue
      }
    })

    if (this.state === "dropped" && this.rippleQueue.length == 0) {
      this.state = "dead"//if circle is dropped and all ripple ends, change state to dead
    }
  }
}