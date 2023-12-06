class Vector2 {
  x: number = 0;
  y: number = 0;
  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }
  magnitude = (): number => {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  normalize = (): void => {
    this.x /= this.magnitude();
    this.y /= this.magnitude();
    return;
  };
  scale = (n: number): void => {
    this.x *= n;
    this.y *= n;
  };
  add = (vector: Vector2) => {
    this.x += vector.x;
    this.y += vector.y;
  };
}
class Particle {
  mass: number = 20;
  location: Vector2 = new Vector2(0, 0);
  velocity: Vector2 = new Vector2(0, 0);
  acceleration: Vector2 = new Vector2(0, 0);
  constructor(_location: Vector2, _velocity: Vector2, _acceleration: Vector2) {
    this.location = _location;
    this.velocity = _velocity;
    this.acceleration = _acceleration;
  }
  accumulateForce = (forceVector: Vector2): void => {
    forceVector.x /= this.mass;
    forceVector.y /= this.mass;
    this.velocity.add(forceVector);
    return;
  };
  moveWithTime = () => {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.scale(0);
  };
  distanceFrom = (vectorPoint: Vector2): number => {
    const D = Math.sqrt(
      Math.pow(this.location.x - vectorPoint.x, 2) +
        Math.pow(this.location.y - vectorPoint.y, 2)
    );
    return D;
  };
}
const radius = 50;
const vector: Vector2 = new Vector2(0, 0);
let locationVector: Vector2 = new Vector2(0, 0);
const canvas: HTMLCanvasElement = document.getElementById(
  "starCanvas"
) as HTMLCanvasElement;
const ctx = canvas!.getContext("2d");
canvas!.style.border = "solid grey 1px";
const data = document.getElementById("data");
let mouseX = 0;
let mouseY = 0;
let velocity: Vector2 = new Vector2(0, 0);
let mouseDirVector: Vector2 = new Vector2(0, 0);
let acclerationVector: Vector2 = new Vector2(5.6, 0);
let moveDirX = 2.8;
let moveDirY = 2.8;
const subtractVectors = (vec1: Vector2, vec2: Vector2): Vector2 => {
  let tempVector: Vector2 = new Vector2(0, 0);
  tempVector.x = vec1.x - vec2.x;
  tempVector.y = vec1.y - vec2.y;
  return tempVector;
};
let time = 10;
let first: boolean = false;
const particles: Array<Particle> = [];
for (let i: number = 0; i < 10; i++) {
  particles[i] = new Particle(
    new Vector2(
      Math.floor(Math.random() * 500),
      Math.floor(Math.random() * 500)
    ),
    new Vector2(0, 0),
    new Vector2(0, 0)
  );
}
mouseX = canvas.width / 2 + 200;
mouseY = 900;
canvas!.addEventListener("mousedown", (e) => {
  let ii = 0;
  const gravity: Vector2 = new Vector2(0.0, 0.01);
  setInterval(() => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
    mouseDirVector = subtractVectors(
      new Vector2(mouseX, mouseY),
      locationVector
    );
    mouseDirVector.normalize();
    mouseDirVector.scale(0.03);
    if (locationVector.x > canvas.width - radius || locationVector.x < 0) {
      velocity.x = -velocity.x;
    }
    if (locationVector.y > canvas.height - radius || locationVector.y < 0) {
      velocity.y = -velocity.y;
    }
    //acclerationVector = mouseDirVector;
    const frictionConstant = 0.0008;
    let frictionVector: Vector2 = new Vector2(0, 0);
    let velCopy = { x: velocity.x, y: velocity.y };
    frictionVector.x = -velCopy.x;
    frictionVector.y = -velCopy.y;
    frictionVector.scale(frictionConstant);
    acclerationVector.add(frictionVector);
    acclerationVector.add(gravity);
    velocity.add(acclerationVector);
    locationVector.add(velocity);
    acclerationVector.x = 0;
    acclerationVector.y = 0;
    const finalLocationVector: Vector2 = new Vector2(
      canvas.width / 2,
      canvas.height / 2
    );
    const distance = !first
      ? Math.sqrt(
          Math.pow(locationVector.x - finalLocationVector.x, 2) +
            Math.pow(locationVector.y - finalLocationVector.y, 2)
        )
      : 0;
    if (distance < radius) {
      first = true;
      data!.innerHTML = `coords: ${vector.x}-${vector.y}-- dist ${distance} -- time ${time}`;
      if (!first) {
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx!.beginPath();
        ctx!.arc(locationVector.x, locationVector.y, radius, 0, 2 * Math.PI);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(canvas.width / 2, canvas.height / 2);
        ctx!.lineTo(locationVector.x, locationVector.y);
        ctx!.stroke();
        vector.x = mouseX;
        vector.y = mouseY;
        return;
      }
    }
  }, time);
});
document!.getElementById("earn")!.addEventListener("click", (e) => {
  const speed = 1.3;
  setInterval(() => {
    ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
    for (let i: number = 0; i < 10; i++) {
      if (particles[i].location.x > mouseX) {
        particles[i].location.x -= speed;
      }
      if (particles[i].location.y > mouseY) {
        particles[i].location.y -= speed;
      }
      if (particles[i].location.x < mouseX) {
        particles[i].location.x += speed;
      }
      if (particles[i].location.y < mouseY) {
        particles[i].location.y += speed;
      }
      ctx!.beginPath();
      ctx!.arc(
        particles[i].location.x,
        particles[i].location.y,
        radius,
        0,
        2 * Math.PI
      );
      ctx!.stroke();
      data!.innerHTML = `${i}`;
      ctx!.beginPath();
      ctx!.moveTo(canvas.width / 2, canvas.height / 2);
      ctx!.lineTo(particles[i].location.x, particles[i].location.y);
      ctx!.stroke();
    }
  });
});
