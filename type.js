var Vector2 = /** @class */ (function () {
    function Vector2(_x, _y) {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.magnitude = function () {
            return Math.sqrt(_this.x * _this.x + _this.y * _this.y);
        };
        this.normalize = function () {
            _this.x /= _this.magnitude();
            _this.y /= _this.magnitude();
            return;
        };
        this.scale = function (n) {
            _this.x *= n;
            _this.y *= n;
        };
        this.add = function (vector) {
            _this.x += vector.x;
            _this.y += vector.y;
        };
        this.x = _x;
        this.y = _y;
    }
    return Vector2;
}());
var Particle = /** @class */ (function () {
    function Particle(_location, _velocity, _acceleration) {
        var _this = this;
        this.mass = 20;
        this.location = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.accumulateForce = function (forceVector) {
            forceVector.x /= _this.mass;
            forceVector.y /= _this.mass;
            _this.velocity.add(forceVector);
            return;
        };
        this.moveWithTime = function () {
            _this.velocity.add(_this.acceleration);
            _this.location.add(_this.velocity);
            _this.acceleration.scale(0);
        };
        this.distanceFrom = function (vectorPoint) {
            var D = Math.sqrt(Math.pow(_this.location.x - vectorPoint.x, 2) +
                Math.pow(_this.location.y - vectorPoint.y, 2));
            return D;
        };
        this.location = _location;
        this.velocity = _velocity;
        this.acceleration = _acceleration;
    }
    return Particle;
}());
var radius = 50;
var vector = new Vector2(0, 0);
var locationVector = new Vector2(0, 0);
var canvas = document.getElementById("starCanvas");
var ctx = canvas.getContext("2d");
canvas.style.border = "solid grey 1px";
var data = document.getElementById("data");
var mouseX = 0;
var mouseY = 0;
var velocity = new Vector2(0, 0);
var mouseDirVector = new Vector2(0, 0);
var acclerationVector = new Vector2(5.6, 0);
var moveDirX = 2.8;
var moveDirY = 2.8;
var subtractVectors = function (vec1, vec2) {
    var tempVector = new Vector2(0, 0);
    tempVector.x = vec1.x - vec2.x;
    tempVector.y = vec1.y - vec2.y;
    return tempVector;
};
var time = 10;
var first = false;
var particles = [];
for (var i = 0; i < 10; i++) {
    particles[i] = new Particle(new Vector2(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)), new Vector2(0, 0), new Vector2(0, 0));
}
mouseX = canvas.width / 2 + 200;
mouseY = 900;
canvas.addEventListener("mousedown", function (e) {
    var ii = 0;
    var gravity = new Vector2(0.0, 0.01);
    setInterval(function () {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
        mouseDirVector = subtractVectors(new Vector2(mouseX, mouseY), locationVector);
        mouseDirVector.normalize();
        mouseDirVector.scale(0.03);
        if (locationVector.x > canvas.width - radius || locationVector.x < 0) {
            velocity.x = -velocity.x;
        }
        if (locationVector.y > canvas.height - radius || locationVector.y < 0) {
            velocity.y = -velocity.y;
        }
        //acclerationVector = mouseDirVector;
        var frictionConstant = 0.0008;
        var frictionVector = new Vector2(0, 0);
        var velCopy = { x: velocity.x, y: velocity.y };
        frictionVector.x = -velCopy.x;
        frictionVector.y = -velCopy.y;
        frictionVector.scale(frictionConstant);
        acclerationVector.add(frictionVector);
        acclerationVector.add(gravity);
        velocity.add(acclerationVector);
        locationVector.add(velocity);
        acclerationVector.x = 0;
        acclerationVector.y = 0;
        var finalLocationVector = new Vector2(canvas.width / 2, canvas.height / 2);
        var distance = !first
            ? Math.sqrt(Math.pow(locationVector.x - finalLocationVector.x, 2) +
                Math.pow(locationVector.y - finalLocationVector.y, 2))
            : 0;
        if (distance < radius) {
            first = true;
            data.innerHTML = "coords: ".concat(vector.x, "-").concat(vector.y, "-- dist ").concat(distance, " -- time ").concat(time);
            if (!first) {
                ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.arc(locationVector.x, locationVector.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, canvas.height / 2);
                ctx.lineTo(locationVector.x, locationVector.y);
                ctx.stroke();
                vector.x = mouseX;
                vector.y = mouseY;
                return;
            }
        }
    }, time);
});
document.getElementById("earn").addEventListener("click", function (e) {
    var speed = 1.3;
    setInterval(function () {
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < 10; i++) {
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
            ctx.beginPath();
            ctx.arc(particles[i].location.x, particles[i].location.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            data.innerHTML = "".concat(i);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(particles[i].location.x, particles[i].location.y);
            ctx.stroke();
        }
    });
});
