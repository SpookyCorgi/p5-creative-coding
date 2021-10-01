//There is a checkbox under the drawing! Check it out!
let spiral = [];
let checkbox
let animation = true

function init () {
  //change values here to experient!!
  //initial value for cos, sin and distance between spirals
  let x, y, r;
  x = y = 0;
  r = 0;
  //initial size for the object
  let size = 5;
  //total amount of the object
  let totalCount = 200;

  for (let i = 0; i < totalCount; i++) {
    //creating the circles
    let circle = {
      x: r * cos(x),
      y: r * sin(y),
      size: size,
      //color: color(random(255),random(255),random(255),150),
    };
    spiral.push(circle);

    //increments of the values
    x += PI / 10;
    y += PI / 10;
    r += 2;
    size *= 1.015;
  }
}
let canvas
function setup () {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0)
  canvas.style('z-index', '-1')
  init();
  //checkbox = createCheckbox('Animation', false);
  //checkbox.changed(animationChange);
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight)
}

/*function animationChange () {
  if (this.checked()) {
    //start animation
    animation = true
    loop()
    console.log('Animation Start!');
  } else {
    //stop loop to save browser memory and power
    animation = false
    noLoop()
  }
}*/



function draw () {
  background(0);

  //draw all the spirals initialized
  spiral.forEach((d, i) => {
    //there are 20 circles per ring, thus module i by 20
    if (i % 20 == 0) {
      if (animation) {
        //millis will increase through time, making result an animation
        rotateY(millis() / 10000);
      } else {
        //i is always the same each loop regardless of time
        rotateY(i / 6);
      }
    }
    //fill(d.color);
    normalMaterial();
    ellipse(d.x, d.y, d.size, d.size);
  });
}
