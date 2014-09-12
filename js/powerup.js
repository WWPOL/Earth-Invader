Powerup = function(x,y,type,array,player) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.name = "powerup";
	this.color = "white";
	if (this.type === "air") {
		this.name = "MULTISHOT";
		this.color = "white";
	} else if (this.type === "fire") {
		this.name = "FASTSHOT";
		this.color = "red";
	} else if (this.type === "water") {
		this.name = "SPLASHSHOT";
		this.color = "blue";
	} else if (this.type === "rock") {
		this.name = "PENETRATE";
		this.color = "brown";
	} else if (this.type === "health") {
		this.name = "HEALTH";
		this.color = "maroon";
	} else if (this.type === "invincibility") {
		this.name = "INVINCIBILITY";
		this.color = "gold";
	}
	this.radius = 5;
	this.alive = true;
	this.powerups = array;
	this.player = player;
	this.timer = 500;
	this.vx = Math.floor(Math.random() * 4) - 2;
	this.vy = Math.floor(Math.random() * 4) - 2;
};

Powerup.prototype.update = function(gc) {
	if (this.alive) {
		this.x += this.vx;
		this.y += this.vy;

		if (this.vx = 0) {
			this.vx = Math.floor(Math.random() * 4) - 2;
		}
		if (this.vy = 0) {
			this.vy = Math.floor(Math.random() * 4) - 2;
		}

		if (this.x < 0 || this.x > gc.width) {
			this.vx *= -1;
		}
		if (this.y < 0 || this.y > gc.height) {
			this.vy *= -1;
		}
		if (this.timer > 0) {
			this.timer--;
		} else {
			this.alive = false;
			var index = this.powerups.indexOf(this);
			this.powerups.splice(index, 1);
		}
	} else {
		var index = this.powerups.indexOf(this);
		this.powerups.splice(index, 1);
	}
}

Powerup.prototype.draw = function(ctx) {
	if (this.alive) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.restore();
		ctx.font = "12pt Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = this.color;
		ctx.fillText(this.name, this.x, this.y - 15);
		
	}
}