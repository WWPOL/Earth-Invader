Bullet = function(x, y, r, dx, dy, speed, damage, color, type, owner, playershot) {
	this.x = x;
	this.y = y;
	this.radius = r;
	this.dx = dx;
	this.dy = dy;
	this.speed = speed; //constant that determines the velocity the bullet travels at
	this.damage = damage; //The damage the bullet does
	this.name = "bullet";
	this.color = color;
	this.birth = Date.now();

	this.alive = true; //Used for determining damage and whether to draw
	this.owner = owner;
	this.playershot = playershot;

	this.rotation = 0;
	this.penetratecount = 0;
	this.currentenemy = 0;
	this.penetrate = false;

	this.type = type;
	if ((this.type === "rock" || powerups.penetrate.toggle) && this.playershot) {
		this.penetrate = true;
		this.radius = 4;
	}
};

//Update the bullet's position
Bullet.prototype.update = function(array){
	if (this.alive) {
		if (this.x < 0 || this.x > winwidth || this.y < 0 || this.y > winheight) {
			this.alive = false;
			var index = array.indexOf(this);
			array.splice(index, 1);
		}
		else {
			this.x += this.speed * this.dx;
			this.y += this.speed * this.dy;
			console.log(this.type + " " + this.speed);
		}
		if ((this.type === "fire") && (distance(this.x,this.y,this.owner.x,this.owner.y) > 250) && (this.playershot)) {
			this.alive = false;
			var index = array.indexOf(this);
			array.splice(index, 1);
		}
		if (this.penetratecount > 3) {
			this.alive = false;
			var index = array.indexOf(this);
			array.splice(index, 1);
		}

	} else {
		var index = array.indexOf(this);
		array.splice(index, 1);
	}
};

//Draw the bullet object
Bullet.prototype.draw = function(ctx) {
	if (this.alive) { //only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.restore();
	}
};