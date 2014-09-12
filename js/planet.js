Planet = function(x, y, name, color, stroke, bullets) {
	this.x = x;
	this.y = y;
	this.health = 10000;
	this.shield = 6000;
	this.name = name;
	this.radius = 100;
	this.color = color;
	this.bullets = bullets;
	this.stroke = stroke;
	this.alive = true;
	this.damagemult = 1;
	this.totaldamage = 1;
	this.dmgcount = 0;
	this.regen = false;
}

Planet.prototype.update = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		this.damagemult = mults[Options.wepType][Options.planType + "dmg"];
		if (this.bullets[i].alive && collision(this,this.bullets[i]) && this.shield > 0) {
			this.shield -= wepTraits[Options.wepType].damage * this.damagemult;
			this.totaldamage += wepTraits[Options.wepType].damage * this.damagemult;
			if (!this.regen) {
				this.dmgcount = 180;
			}
			this.bullets[i].alive = false;
		} else if (this.bullets[i].alive && collision(this,this.bullets[i]) && this.health > 0) {
			this.radius = 70;
			this.health -= wepTraits[Options.wepType].damage * this.damagemult;
			this.totaldamage += wepTraits[Options.wepType].damage * this.damagemult;
			this.bullets[i].alive = false;
		} else if (this.bullets[i].alive && collision(this,this.bullets[i])) { //if it collides with a bullet, kill itself and the bullet
			this.bullets[i].alive = false;
			this.alive = false;
		}
	}
	if (this.dmgcount > 0) {
		this.dmgcount--;
	}
	if (this.shield < 3000 && this.shield >= 0 && this.dmgcount == 0) {
		this.shield += 0.25; //shield will regenerate very slowly
		this.regen = false;
	}
	if (this.shield > 0) {
		this.radius = 135;
	}
	if (this.shield <= 0) {
		this.radius = 70; //collision detection radius set to 40 (shield), reduced when shield is 
	}
	if (this.shield < 0) {
		this.shield = 0;
		this.dmgcount = 1500;
		this.regen = true;
	}
	if (this.health <= 0) {
		this.health = 0;
		this.alive = true;
	}
}

Planet.prototype.draw = function(ctx) {
	if (this.alive) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 70, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = this.stroke;
		ctx.stroke();

		//draw shield
		var shieldColor = "#"; 
		for (var i = 0; i < 3; i++) {
			shieldColor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}

		ctx.beginPath();
		ctx.arc(this.x, this.y, 135, 0, 2 * Math.PI, false);
		ctx.lineWidth = 7;
		ctx.strokeStyle = shieldColor;//rgb(Math.floor(100 + 70*Math.random()),Math.floor(100 + 70*Math.random()),Math.floor(100 + 70*Math.random()));
		if (this.shield > 0) { //only draw if greater than 0
			ctx.stroke(); 
		}
		ctx.closePath();
	}
}