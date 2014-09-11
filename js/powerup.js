Powerup = function(x,y,type,array,player) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.name = "powerup";
	this.color = "white";
	if (this.type === "tri") {
		this.name = "MULTISHOT";
		this.color = "white";
	} else if (this.type === "fast") {
		this.name = "FASTSHOT";
		this.color = "red";
	} else if (this.type === "splash") {
		this.name = "SPLASHSHOT";
		this.color = "blue";
	} else if (this.type === "penetrate") {
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
	this.targetx = Math.floor((Math.random() * (winwidth - 20) + 10));
	this.targety = Math.floor((Math.random() * (winwidth - 20) + 10));
};

Powerup.prototype.update = function() {
	if (this.alive) {	
		this.playerX = this.player.x;
		this.playerY = this.player.y;

		// Calculate direction towards player
		var toPlayerX = this.playerX - this.x;
		var toPlayerY = this.playerY - this.y;

		// Normalize
		var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
		toPlayerX = toPlayerX / toPlayerLength;
		toPlayerY = toPlayerY / toPlayerLength;
		if (toPlayerLength < 20) {
			this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
			this.x -= toPlayerX;
			this.y -= toPlayerY;
		} else {
			var dx = this.targetx - this.x; //use the global variables!
			var dy = this.targety - this.y;
			var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
			this.x += dx/distance;
			this.y += dy/distance;
		}
		if ((Math.abs(this.x + this.targetx) < 20) || (Math.abs(this.y + this.targety) < 20)) {
			this.targetx = Math.floor((Math.random() * (winwidth - 20) + 10));
			this.targety = Math.floor((Math.random() * (winwidth - 20) + 10));
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
		ctx.font = "12pt Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.name, this.x, this.y - 15);
		ctx.restore();
	}
}