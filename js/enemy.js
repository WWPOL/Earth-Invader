//Init the enemy class
Enemy = function(x, y, width, height, orbit, type, pBullets, eBullets, isboss) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.isboss = isboss;

	this.splash = false;

	this.type = type;
	this.speed = enemyTraits[this.type].speed;
	this.orbit = orbit; //property determining distance of orbit
	this.health = enemyTraits[this.type].health;
	this.damage = enemyTraits[this.type].damage;

	this.damagemult = 1;

	this.rof = enemyTraits[this.type].rof; //rate of fire
	this.count = 0; //counter for shooting
	this.trigger = Math.floor(Math.random()*this.rof); //number 0 to rof-1 that will be used as signal to fire

	this.pBullets = pBullets; //player bullets, object will check for collision with these
	this.eBullets = eBullets; //enemy bullets, object will push a new Bullet to these every time it shoots
	this.burncount = 0;
	this.slowcount = 0;

	this.radius = this.width * 1.2; //have collision circle cover corners better at expense of overcoverage on middle of sides

	this.alive = true; //used for determining damage and whether to draw
	this.explode = false;

	//This allows for the enemy to rotate to face the player
	this.rotation = 0;

	if (this.isboss) {
		this.health *= 10;
		this.speed = 3;
		this.damage *= 3;
	}
	this.slowspeed = this.speed / 2;
	this.normspeed = this.speed;
};

//Tells the enemy object which object to follow, in the actual game, it will be the player
Enemy.prototype.assignplayer = function(player) {
	this.player = player;
};

//Update the enemy's position
Enemy.prototype.update = function(planet, ctx, earray) {
	if(! (this.player === undefined) && this.alive){ //only update if alive
		this.count = (this.count+1) % this.rof; //update counter
		var ctx = ctx;
		var enemies = earray;
		this.playerX = this.player.x;
		this.playerY = this.player.y;

		// Calculate direction towards player
		var toPlayerX = this.playerX - this.x;
		var toPlayerY = this.playerY - this.y;

		// Normalize
		var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
		toPlayerX = toPlayerX / toPlayerLength;
		toPlayerY = toPlayerY / toPlayerLength;

		this.rotation = Math.atan2(toPlayerY, toPlayerX);

		if (this.slowcount > 0) {
			this.slowcount--;
			this.speed = this.slowspeed;
		} else {
			this.speed = this.normspeed;
		}
		if (this.burncount > 0) {
			this.burncount--;
			this.health--;
		}

		////////SHOOTING////////
		if (this.count == this.trigger && this.player.name !== "Planet") { //don't shoot if orbiting the planet
			if (this.isboss) {
				var bullet = new Bullet(this.x, this.y, 6, toPlayerX, toPlayerY, 8, this.damage, enemyTraits[this.type].bulletColor, Options.planType, this, false);
			} else {
				var bullet = new Bullet(this.x, this.y, 3, toPlayerX, toPlayerY, 8, this.damage, enemyTraits[this.type].bulletColor, Options.planType, this, false);
			}
			/*var shoot = new Audio();
			shoot.src = sounds[this.type].shoot;
			shoot.volume = Options.volume;
			shoot.play();*/
			this.eBullets.push(bullet);
		}

		////////MOVEMENT////////

		var approach = true; // tracks if enemy is currently approaching player
		//Move towards the player
		if ((toPlayerLength > this.orbit+5 || this.player.shield <= 0) && this.player !== planet){ //if shield is down enemy will continue to approach 
			this.angle = Math.atan2(toPlayerY,toPlayerX)+Math.PI;
			this.x += toPlayerX * this.speed;
			this.y += toPlayerY * this.speed;
			//approach = true;

		}//Move away from player
		else if (toPlayerLength < this.orbit-5){
			this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
			this.x -= toPlayerX * this.speed * 2;
			this.y -= toPlayerY * this.speed * 2;
			//approach = true;

		}//orbit
		else{
			this.angle -= 0.02;//Math.acos(1-Math.pow(3/toPlayerLength,2)/2);
			this.x = ((toPlayerLength * Math.cos(this.angle)) + (this.player.x));
			this.y = ((toPlayerLength * Math.sin(this.angle)) + (this.player.y));
			
		}


		//check for collision with bullet
		for (var i = 0; i < this.pBullets.length; i++) {
			this.damagemult = mults[Options.wepType][this.type + "dmg"];
			if (this.pBullets[i].alive && collision(this,this.pBullets[i]) && this.health > 0) {
				if (!this.pBullets[i].penetrate) {
					this.pBullets[i].alive = false;
					this.health -= wepTraits[Options.wepType].damage * this.damagemult;
				} else if (this.pBullets[i].penetrate && this !== this.pBullets[i].currentenemy) {
					this.pBullets[i].currentenemy = this;
					this.pBullets[i].penetratecount += 1;
					this.health -= wepTraits[Options.wepType].damage * this.damagemult;
				}
				if(Options.wepType === "water" || powerups.splash.toggle){
					enemies.forEach(function(enemy){
						if(enemy !== this){
							if(distance(this.x, this.y, enemy.x, enemy.y) <= 250){
								enemy.slowcount = 100;
								enemy.health -= wepTraits[Options.wepType].damage * this.damagemult;
								/*var splashnoise = new Audio();
								splashnoise.src = sounds.water.death;
								splashnoise.volume = Options.volume;
								splashnoise.play();*/
								ctx.save();
								ctx.translate(this.x, this.y);
								ctx.rotate(this.rotation);
								ctx.drawImage(enemyTraits.water.boom,-24,-24,48,48);
								ctx.restore();
							}
						}
					});
					this.slowcount = 100;
				}
				if (Options.wepType === "fire") {
					this.burncount = 100;
				}
				if (Options.wepType === "air") {
					this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
					this.x -= toPlayerX * this.speed * 30;
					this.y -= toPlayerY * this.speed * 30;
				}
				/*var hit = new Audio();
				hit.src = sounds[this.type].hit;
				hit.volume = Options.volume;
				hit.play();*/
			} else if (this.pBullets[i].alive && collision(this,this.pBullets[i])) { //if it collides with a bullet, kill itself and the bullet
				this.alive = false;
				enemiesKilled += 1;
				this.explode = 1; //draw explosion sprite
				/*var eDeath = new Audio();
				eDeath.src = sounds[this.type].death;
				eDeath.volume = Options.volume;
				eDeath.play();*/
			}
		}
	}
};

//As it sounds, draw the enemy object
Enemy.prototype.draw = function(ctx, array) {
	if (this.alive) { //only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		if(this.splash){
			
		}
		if (this.isboss) {
			ctx.drawImage(enemyTraits[this.type].img,-18,-18,36,36);
		} else {
			ctx.drawImage(enemyTraits[this.type].img,-6,-6);
		}
		ctx.restore();
	} else if (this.explode) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		if (this.isboss) {
			ctx.drawImage(enemyTraits[this.type].boom,-24,-24,48,48);
		} else {
			ctx.drawImage(enemyTraits[this.type].boom,-14,-14,28,28);	
		}
		ctx.restore();
		this.explode = (this.explode+1)%7; //add a count, when this.explode hits 4 (or 0) it will go false
	} else if (!this.alive && !this.boom) {
		var index = array.indexOf(this);
		array.splice(index, 1);
	}
};