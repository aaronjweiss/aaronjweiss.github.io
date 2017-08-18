var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };
var canvas = document.createElement("canvas");
var pong = document.getElementById("pong");

var width = pong.offsetWidth;
var height = pong.offsetHeight;
canvas.width  = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(width/2, height/2);

var keysDown = {};

var render = function () {
    //context.fillStyle = "#F5F5F5";
    //context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

var update = function () {
    player.update(ball);
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > width) {
        this.x = width - this.width;
        this.x_speed = 0;
    }
};

function Computer() {
    this.paddle = new Paddle(10, (height/2)-25, 10, 50);
}

Computer.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.update = function (ball) {
    var y_pos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
    if (diff < 0 && diff < -4) {
        diff = -5;
    } else if (diff > 0 && diff > 4) {
        diff = 5;
    }
    this.paddle.move(0, diff);
    if (this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > height) {
        this.paddle.y = height - this.paddle.height;
    }
};

function Player() {
    this.paddle = new Paddle(width-20, (height/2)-25, 10, 50);
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function (ball) {
    var y_pos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
    if (diff < 0 && diff < -4) {
        diff = -5;
    } else if (diff > 0 && diff > 4) {
        diff = 5;
    }
    this.paddle.move(0, diff);
    if (this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > height) {
        this.paddle.y = height - this.paddle.height;
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
	this.x_speed = 3*randomDirection();
    this.y_speed = (Math.random()*1.5)*randomDirection();
}

function randomDirection() {
	var dir = Math.random() - 0.5; //create random number that can be positive or negative
		
		//normalize direction
		if(dir < 0)
			dir = -1;
		else
			dir = 1;
	
	return dir;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "#0000FF";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.y - 5 < 0) {
        this.y = 5;
        this.y_speed = -this.y_speed;
    } else if (this.y + 5 > height) {
        this.y = height-5;
        this.y_speed = -this.y_speed;
    }

    if (this.x < 0 || this.x > width) {	
        this.x_speed = 3*randomDirection();
        this.y_speed = (Math.random()*1.5)*randomDirection();
        this.x = width/2;
        this.y = height/2;
    }
	
	if (top_x > width/2) {
        if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
            // hit the player's paddle
			  this.x_speed = -3;
			  this.y_speed += (paddle1.y_speed / 2);
			  this.x += this.x_speed;
        }
    } else {
        if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
            // hit the player's paddle
			  this.x_speed = 3;
			  this.y_speed += (paddle2.y_speed / 2);
			  this.x += this.x_speed;
        }
    }
};

//document.body.appendChild(canvas);
pong.appendChild(canvas);
animate(step);
