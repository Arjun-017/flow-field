import { noise } from "./perlin-noise/index.js";

const canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const scale = 10;
const FPS = 60;

const rows = Math.floor(canvas.width / scale);
const cols = Math.floor(canvas.height / scale);

let xoff = 10;
let yoff = 10;
let time = 0;
let MAX_PARTICLES = 200;

let particles = [];

class Particles {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.prevPosition = { x: 0, y: 0 };
    this.position.x = Math.random() * canvas.width;
    this.position.y = Math.random() * canvas.height;
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.velocity.x = Math.random() * 2;
    this.velocity.y = Math.random() * 2;
    this.acceleration.x = Math.random() * 2;
    this.acceleration.y = Math.random() * 2;
    this.maxSpeed = 10;
    this.color = "rgba(144, 238, 144, 0.1)";
  }
  draw() {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.prevPosition.x, this.prevPosition.y);
    ctx.lineTo(this.position.x, this.position.y);
    ctx.stroke();
  }
  update() {
    this.updatePrevPosition();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    var mag = Math.sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );
    this.velocity.x = (this.velocity.x * this.maxSpeed) / mag;
    this.velocity.y = (this.velocity.y * this.maxSpeed) / mag;
  }
  updatePrevPosition() {
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
  }
  edges() {
    if (this.position.x <= 0) {
      this.position.x = canvas.width - 1;
      this.updatePrevPosition();
    }
    if (this.position.x >= canvas.width) {
      this.position.x = 0;
      this.updatePrevPosition();
    }
    if (this.position.y <= 0) {
      this.position.y = canvas.height - 1;
      this.updatePrevPosition();
    }
    if (this.position.y >= canvas.height) {
      this.position.y = 0;
      this.updatePrevPosition();
    }
  }
  flow(directions, scale) {
    var x = Math.floor(this.position.x / scale);
    var y = Math.floor(this.position.y / scale);
    var angle = directions[x][y];
    this.acceleration.x = Math.cos(angle);
    this.acceleration.y = Math.sin(angle);
  }
}

function change(time) {
  var directions = [];
  var temp = [];
  for (var i = 0; i <= rows; i++) {
    temp = [];
    for (var j = 0; j <= cols; j++) {
      var n = noise(i / xoff + time, j / yoff + time);
      temp.push(n * 2 * Math.PI);
    }
    directions.push(temp);
  }
  return directions;
}

function init() {
  for (var n = 0; n < MAX_PARTICLES; n++) {
    var p = new Particles();
    particles.push(p);
  }
}

function animate() {
  requestAnimationFrame(animate);
  var directions = change(time);
  time += 0.0001;
  for (var n = 0; n < MAX_PARTICLES; n++) {
    var p = particles[n];
    p.edges();
    p.draw();
    p.flow(directions, scale);
    p.update();
  }
}

function main() {
  init();
  animate();
}

main();
