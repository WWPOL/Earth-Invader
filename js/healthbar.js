Healthbar = function(x, y, owner, mini) {
	this.x = x;
	this.y = y;
	this.owner = owner;
	this.maxhealth = owner.health;
	this.health = owner.health;
	this.healthpercent = 1;
	this.name = owner.name;
	this.playsound = true;
	this.ismini = mini;
	this.alive = true;
	if (owner.shield) {
		this.maxshield = owner.shield;
		this.shield = owner.shield;
		this.shieldpercent = 1;
	}
}

Healthbar.prototype.update = function() {
	this.health = this.owner.health;
	this.healthpercent = this.health / this.maxhealth;
	this.alive = this.owner.alive;
	if (this.shield !== false && this.owner.shield !== false) { //use triple equality, b/c 0 == false, and updates will stop at 0 and not draw correctly
		this.shield = this.owner.shield;
		this.shieldpercent = this.shield / this.maxshield;
	}
	if (!this.alive) {
		delete this;
	}

}

Healthbar.prototype.draw = function(ctx) {
	if (this.alive) {
		ctx.beginPath()
		ctx.fillStyle = "red";
		if (this.ismini) {
			ctx.fillRect(this.owner.x - 50, this.owner.y - 45, 100 * this.healthpercent, 5);
		} else {
			ctx.fillRect(this.x, this.y, 300 * this.healthpercent, 20);
		}
		ctx.font = "12pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		if (!this.ismini) {
			ctx.fillText(this.name, this.x + 150, this.y + 15);
		}

		if (this.shield > 0) {
			ctx.fillStyle = "blue";
			if (this.ismini) {
				ctx.fillRect(this.owner.x - 50, this.owner.y - 35, 100 * this.shieldpercent, 5);
			} else {
				ctx.fillRect(this.x, this.y + 30, 300 * this.shieldpercent, 20);
			}
			ctx.font = "12pt Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			if (!this.ismini) {
				ctx.fillText("Shields", this.x + 150, this.y + 45);
			}
			this.playsound = true;
		} else if (this.shield === 0) {
			if (this.playsound) {
				this.playsound = false;
			}
			ctx.fillStyle = "white";
			ctx.font = "12pt Arial";
			ctx.textAlign = "center";
			if (!this.ismini) {
				ctx.fillText("Shields down!", this.x + 150, this.y + 45);
			}
		} else if (this.shield <= 0) {
			ctx.fillStyle = "white";
			ctx.font = "12pt Arial";
			ctx.textAlign = "center";
			if (!this.ismini) {
				ctx.fillText("Shields down!", this.x + 150, this.y + 45);
			}
		}
		ctx.closePath();
	}
}