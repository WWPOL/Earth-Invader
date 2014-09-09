///////////////// GLOBAL VARIABLES \\\\\\\\\\\\\\\\\
var currentcanvas;
var keysDown = {};
var mouseX = 0; //global mouse coords
var mouseY = 0;

var winheight = 0; //window width & height
var winwidth = 0;

var score = 0;
var enemiesKilled = 1;
var time = 0;
var scoremult = 1;
var paused = false;
var muted = false;
var starting = true;
var timer = 3;
var highscore = localStorage.getItem('highscore');

////////////////// LOAD IN SPRITES \\\\\\\\\\\\\\\\\\
var sprite_player = new Image();

var sprite_fire = new Image();
var sprite_rock = new Image();
var sprite_water = new Image();
var sprite_air = new Image();

var boom_fire = new Image();
var boom_rock = new Image();
var boom_water = new Image();
var boom_air = new Image();

sprite_player.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH3gkGAh069n+LkgAAAhBQTFRF+vr5////AAAABQUFDw4LExEOExIOFBMQFhYRGBcUGBcXGRkZHBsTHh0YHh0bHx4NISAaIyMTJCESJSMhJiUaKCckKyobKyonLCgjLSwrLiwnMC8rMysdMzIvNTQvNjQhOzkaPDo2Pjw2Pz48QD44Qj83Q0A7REI+RUIeRUQzR0IlR0VBSkhETEpATUxGTksdUCcZUU9KU1EkVFFMVUA6VzorV0xIV1VRWSYQWVFHWktAXlRNXlxAX1lUYFwgYV5YY2JZZz4wZ2FYZ2RdaV1ZakU1amdkbC8cbFBEb1ZHcGJacG4ycWc/cW0hdGBZdnNwd2lid2phd3JJeGVfenAVfFI9fHd0fT4qfWBRfWJZfXs9f1hNgDMggX58gyQWg3Nvg3lEhEUxhGlahoSDhz0ni4MgjH1WjIF8jUw1jygLkjYeknpLk4NilUYrlkk4lmxZmDobmJAVm4lInFI8n4RVn5gno4pao4xYpDQbqzcarFxKrUcqrm5Mr5YXr5tUsE81sJBMsj0dskoqui8UvLMRvSgGwJdQxDMRxDobxJtBxZs8xbtBxrNPxsFWyKBNyZw4ykknypM6zsZgz8hG0jUO06Ey08pU081p1cs/2isI285G3NR44DkI4D8T4rMu5EET5z0R6DYJ6DkJ6EUW6T8O7DIE7jgJ70ET8e+/8jwR9CMN9DoH9vTg+fOz+/fW/Pry+p9c2AAAAAJ0Uk5TAAB2k804AAAAAWJLR0QB/wIt3gAAAVpJREFUKM9jYMQFGIiTWYZDZvH8uQsWYJFpyw91dAzPLY5mQJPpy3HSU1VSVzd3i0WVAUoYK0lJq6hp2/onI8u0pTnpyYkI8EgpKWnb+6cjZPqzbZk4uXlEBCTklNSsXIKr4DJFluqc7DwKdvoK8tKmla5meTAZH01ZUV4RjajZ00uNZNynpJikLATJrGQR4uHg4uAQtJu+ZsWsVIu45oKsijkgmVXzZrCxsbGwcgRNWr9uWm1m68wpU6bMWQrWw68lJszFxWvTvW7t5EKDuPbcxMZFUHt6EnTlRPkEQnont+hLxCxs9KheBnNbnZ+hsriAmLevhoSsY0dexAS4q7tKAozVJPm4BYTFFc08vZIQMoz95YHmytzMLNLKOubO/vHI4dZZBpQSkNbRM3cOi0UN66kNwdaWxobGDv6x6PEzsaa+qTrDIzIeS5wuX7Jk/lwc6WA1GWkHBQAAvH1XOkRKwwEAAAAASUVORK5CYII=';

sprite_fire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAOVBMVEUAAAD/ugD/xgD/kwD/vgD/hwD/fQD/6AD/swD/qAD/3AD/nwD/mgD/ggD/lgD/jgD/1QD/0AD/dwAZEj0xAAAAAnRSTlMADH8lgRMAAABiSURBVAgdBcGHAcMgEACxy3c6eP9hIwEw7SYAsHW5vZ4AHjFm2esJxPfFbiWvw4wv/MxRcpPla+w9WxPpfHFUhzYzecy1lquWmVxQPe5lJfcHHrpHK+kJcI42k54AwGiSAH82EAPJABiB9wAAAABJRU5ErkJggg==';
sprite_rock.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAKlBMVEUAAACWTBeGQhKKRBOCQBJxOBBtNg+QSBV0OhBfMA59PhF4PBFmMw9IJQ2Rt3ZcAAAAAXRSTlMAQObYZgAAAFlJREFUCNdjYGAQFGQAkUZKhgwMjELaW5QFGBg1wsJWKTCYu+Yc63JnKNp69maEM4NQ6Nybqc4MwkszZ2a7MzC7hh3bosDAqOLR1VTAwCBs4qIOMqbYmIEBAAogE865++QUAAAAAElFTkSuQmCC';
sprite_water.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAV1BMVEUAAACE0vuE0vsJgsEUisUJeLELdKoikstCqd4If7w8pds2oNcdj8oQgrwJfLkNe7QwnNMYjMgOhsMUf7d8zvdtxfNbuekyn9cllc8hi8AaiMAypuRPseOwitA1AAAAA3RSTlMAEgSF73AUAAAAa0lEQVQIHQXBhQHDMBAAsUsfzHaY2v3nrMSHzxTqHQCAb1lkTe0BuOIiKt1sADGsKuO9m0O+VMXsPHJziqok3/b9VGdWSebjd0R1iqoks7Zod5irSOpm3YFcwioisjlAjnOtYRsAMMXwPgB/e/QEuuONR8gAAAAASUVORK5CYII=';
sprite_air.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAS1BMVEUAAADt7e3o5+e6tLTq6uro5ubv7+/n5ubs7Ozu7u7d2tra19fv7+/Szs7s6+vY1NTp6Ojh3d3n5eXk4eHKxcXFwMC7tbWopKSyrq4u3EvSAAAACXRSTlMANB7+OygEQUBBWsCSAAAAbElEQVQIHRXBhwHDIAwEwAe3qEvgkv0njXMHYP0QpfQVrzaGu4+4GtCzWISz7F6xkSplSYTtIKW/FLMF5C7CEmLXg5zFrzBbHpCSu49iO7/Yk0jVJ9t5o40xSyLClg4ck1l1yrnh1TZVqr0DP+LRBkPdaWJGAAAAAElFTkSuQmCC';

boom_fire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAilBMVEUAAAD/Pw//Lw//kAP/Qwz/QAz/FxL/fgT/aAb/hgP/Swn/cgX/dwT/UQj/YQb/iwP/ngL/Rwr/Wgf/bQb/dQX/Kw7/Nwz/Sgn/fgD/ExP/Kg//ewP/agX/Pwv/VQj/FxL/YQb/agX/Tgj/FBP/Pwz/HhH/nAH/owL/mAL/qQH/yAD/uQH/sAH/1gAycOBjAAAAJ3RSTlMAAgT+BgsJ/v389/39/Pn+/vv7+PXz8vEcFhH69vT08vDs4y387iQsv7HRAAAAnUlEQVQIHQXBhQHCQBAEwD15jbvgGgH6b48ZQEdWoLsbgCbY16UnGjIC9GIBe4qeY6LQvmIQc57mQ3G0R88ATcypJOWhFQKjqmtqZd1kdYwR5po4WT77Rw4NGxDRLS33374UiX8CoKYov9uyyMRvmOhdK5uTEGZlZPnV3tK1ltydyeAOYAhNHyhmM2AAOoVH543GzEB17M52flRKAP4ZPwpqAq4EtQAAAABJRU5ErkJggg==';
boom_rock.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAbFBMVEV1Xg6ehQ1sVg8AAAChiAyulAyQeA2AaQ+JcQ91XxF5Yg5/aA9oUw9fSRCJcQ2HcA9mUA98ZA5tVxByXBBfShBnUQ9tVw+UfQ5tVw9wWg9nUQ9oUhBfShCMcw+XfQ+FbBCbgwuqjhaylhmfhBJCRDr6AAAAHXRSTlMEAQwADAf+/f79/PUIFBT3/v79+/r59/cb99mBd8UDXQUAAACWSURBVAgdDcEHAsIgEATAXY7e0uwKJPH/f9QZwIBakKApEKiYMpm84WNMGZhHojgrxlkQouaW0BqWDgHIS/Qh9GEhNADLzbnw7S0LgJJLcq4d32Xd3h/c733f+3F2P3yM0Pp6ncN5NM+qK0jFS9v3tkDhT/Tkg7UxqD+ImUat1ujtWZAhLipmS431hQLeHjR1UkatG9QPaPsInqWXDWQAAAAASUVORK5CYII=';
boom_water.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAxlBMVEUAAABCltg6iNIzhdAfXcIiXcM0dcw3jtNCftBDkdYvb8k5ktQqeswkascwiNAvhc8tgM04mtc7jNMphM4sf809ktVBodpDnNgqfcwziNAugs43jtMldskyhdA6l9YofMswjdExfc4aY8Myd8w4idEjbsg6jtM4hdBHsd9MsuArbsk7pNk4htAaY8Mvd8s0l9QibscfZsQ1k9QwcMkxg881i9I5jtMqectIoNpJlddGg9MzjNI8ltZRvuRKtuBOseBHsN9Eqtxc7/LmAAAAO3RSTlMADwkDEAgC/R0VBf37Hv7+/v39/Pbz/v39+fn28/Lw8O7t7amki2VUJh8a/v349vX18O/s4c20oYhIMg6F3XkAAACuSURBVAgdBcEFAsIwAASwq8vccBju7tBh//8UCWADIe2lRyFBOWh6WgrW9wQwLzjoSI2NPFZA0Cs0pL63ZmanKO/Xxwyckau/Sdw0q20NoINgEkerMPutnxBoN1uNKH5/v+mMMII8i8Kk9np9lAvzMyhbDOPf+1NXfl52IcAPlXNVWk2l5YAYeo2b70ZeV4MDE883pHTkkQyIhGnvKZYdZdmiGAgwArB5p6khCbV/ugkQqCbu2aMAAAAASUVORK5CYII=';
boom_air.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAq1BMVEUAAADp4+Px7e3t5ubo4eHa09PVysrv7Ozu5+fm39/z8PDw6enf2dno4+PZ0tLVycnj29vq5OT08/Ps5ubr5ubs6ur+/PzAsLD8+/vAtrb28/PLvr7SysrEtbXPyMjQycnz8fHi3Nzazs7f2tr29PTs6eni39/n4+PNwMC7s7PDsrLr5eXRw8Pq4+PLvr7s6urFtrbp5ubFtLT////18vLr4+Ph2Njq39/d09Mjzk5BAAAANHRSTlMA/v7++vn49AL+/f317u0H+vn19PDeSy0QDwn78fHw6ebk4uHUv7+glIiDZ1RJRzw1Ix8cfDwE3AAAAItJREFUCB0FwQVig0AAALAc7tRt7u5A+/+XLQG+1o9w2PjoC37yG/x1revuc1fs8znbJtl4ytv3w3YZ+85q6PLVbRqit9MAdmkZx2OUDOegf8nKcQynYwavF2fZNEXHKa6i2ZWH1TIJZRhDjF9IQxQPQw3QhEhVV+jxPJsjXbQUXCYNuFsAKOxZ3/MP1sYKW7vFUKgAAAAASUVORK5CYII=';
/////////////////------------------\\\\\\\\\\\\\\\\\

var renderops = {
	main: false,
	levelselect: false,
	game: false
};

var Options = {
	planType: "fire",
	wepType: "fire",
	volume: 0.5
};

var powerups = {
	trishot: false,
	fastshot: {
		toggle: false,
		nrof: 15,
		frof: 7
	},
	penetrate: false,
	splash: false
};

var normvol = Options.volume;

var sounds = {
	player: {
		fire: [3,0.3758,0.0389,0.4992,0.56,0.5291,,,0.0115,0.1529,0.2918,-0.2967,-0.849,-0.2789,,-0.3001,-0.1337,0.4522,0.9619,0.0049,-0.543,0.0878,0.0741,0.5],
		air: [2,,0.242,,0.2856,0.5935,0.2,-0.1545,,,,,,0.4263,-0.3038,,,,1,,,0.1972,,0.5],
		water: [3,,0.14,0.5702,0.4047,0.97,,,,,,0.0856,0.7404,,,0.4366,,,1,,,,,0.5],
		rock: [2,,0.1486,0.0618,0.0313,0.3235,0.0103,-0.4143,,,,,,0.2042,0.1735,,,,1,,,,,0.5],
		death: [0,0.0344,0.2434,0.0007,0.6978,0.5593,,0.0009,-0.1852,0.188,,-0.8373,0.5945,-0.8342,-0.0007,,0.0003,-0.0709,0.9177,-0.1776,0.7897,,0.0001,0.5],
		hit: [1,,0.0125,,0.1674,0.6682,,-0.3997,,,,,,,,,,,1,,,,,0.5],
		shielddown: [3,,0.2837,0.5598,0.4561,0.0189,,,,,,,,,,,,,1,,,,,0.5],
		shieldback: [1,0.9203,0.7129,0.2955,0.369,0.5223,,-0.0713,0.1758,0.7845,0.9862,-0.968,-0.8643,0.7915,-0.0807,,-0.3867,-0.0029,0.9063,0.0015,,0.0282,-0.0049,0.5]
	},
	planet: {
		death: [3,,0.2159,0.7801,0.97,0.07,,,,,,,0.89,,,,,0.32,0.79,,0.11,0.4,-0.36,0.5],
		hit: [3,,0.0112,,0.31,0.0875,,-0.0122,,,,0.422,0.8441,,,,0.1835,-0.0441,1,,,,,0.5]
	},
	fire: {
		hit: [2,,0.011,,0.2299,0.6347,0.0408,-0.4464,0.2178,0.0469,0.0193,0.0419,0.0302,0.0684,0.0369,0.0177,-0.0717,0.0732,0.9868,-0.0122,0.0097,0.074,-0.0184,0.5],
		shoot: [1,,0.1636,0.2996,0.2184,0.5588,0.2816,-0.2181,,,,,,0.2688,0.0118,,0.1677,-0.0588,1,,,,,0.5],
		death: [3,,0.3766,0.2533,0.4427,0.1865,,-0.2766,,,,-0.2171,0.8871,,,0.7384,0.5009,-0.2509,1,,,,,0.5]
	},
	air: {
		hit: [1,,0.0536,,0.2621,0.631,,-0.4006,,,,,,,,,,,1,,,,,0.5],
		shoot: [2,,0.1136,0.1444,0.3466,0.9639,0.2139,-0.2432,,,,,,0.8125,-0.3376,,,,1,,,0.2307,,0.5],
		death: [3,,0.2042,0.2207,0.4078,0.1535,,0.2536,,,,0.0739,0.7854,,,,-0.1692,-0.2249,1,,,,,0.5]
	},
	water: {
		hit: [1,,0.01,,0.2682,0.7035,,-0.367,,,,,,,,,,,1,,,0.1467,,0.5],
		shoot: [0,,0.3498,,0.2535,0.3297,,0.2893,,,,,,0.0596,,,,,0.8007,,,0.0934,,0.5],
		death: [3,,0.3065,0.6898,0.3659,0.042,,0.2063,,,,-0.6731,0.6848,,,,,,1,,,,,0.5]
	},
	rock: {
		hit: [3,,0.0129,,0.28,0.2587,,-0.5081,,,,,,,,,,,1,,,,,0.5],
		shoot: [2,0.0518,0.19,0.31,0.3405,0.3398,0.0424,-0.4251,0.0355,0.1033,0.1365,-0.0342,0.0407,0.0517,-0.0559,0.0628,0.3034,-0.2626,1,0.0017,0.0805,0.0027,-0.0163,0.5],
		death: [3,,0.2477,0.2528,0.4555,0.0385,,0.044,,,,-0.247,0.7443,,,,,,1,,,,,0.5]
	},
	powerup: {
		trishot: [0,0.0474,0.1545,0.4804,0.518,0.4414,0.1353,-0.0068,0.0824,,,-0.0384,0.0189,0.0616,0.0708,0.115,0.0828,0.0371,0.8901,-0.1333,0.0065,0.0344,0.0251,0.5]
	},
	click: [0,,0.1601,,0.0198,0.586,,,,,,,,0.5755,,,,,1,,,0.1,,0.5]
}

var planTraits = {
	fire: {
		plancolor: "#F72A0A",
		planstroke: "#CF2308"
	},
	air: {
		plancolor: "#DEDEDE",
		planstroke: "#BFBFBF"
	},
	water: {
		plancolor: "#076DF2",
		planstroke: "#0658C4"
	},
	rock: {
		plancolor: "#6B4303",
		planstroke: "#593802"
	}
}

var wepTraits = {
	fire: {
		color: "orange",
		rof: 5, //rate of fire
		speed: 15,
		damage: 5
	},
	air: {
		color: "ghostwhite",
		rof: 50,//12,
		speed: 15,
		damage: 20
	},
	water: {
		color: "deepskyblue",
		rof: 20,
		speed: 20,
		damage: 10
	},
	rock: {
		color: "saddlebrown",
		rof: 30,
		speed: 10,
		damage: 25
	}
}

//var enemycolors = ["#CF2308", "#BFBFBF", "#0658C4", "#593802"];
var enemyTraits = {
	fire: {
		img: sprite_fire,
		boom: boom_fire,
		speed: 4,
		rof: 20,
		health: 50,
		damage: 10,
		bulletColor: "orange"
	},
	air: {
		img: sprite_air,
		boom: boom_air,
		speed: 5,
		rof: 100,
		health: 25,
		damage: 5,
		bulletColor: "ghostwhite"
	},
	water: {
		img: sprite_water,
		boom: boom_water,
		speed: 3,
		rof: 100,
		health: 75,
		damage: 15,
		bulletColor: "deepskyblue"
	},
	rock: {
		img: sprite_rock,
		boom: boom_rock,
		speed: 2,
		rof: 100,
		health: 100,
		damage: 20,
		bulletColor: "saddlebrown"
	}

}
/////////////////------------------\\\\\\\\\\\\\\\\\


///////////////// CLASSES \\\\\\\\\\\\\\\\\\\\\\\\\\
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
};

//Tells the enemy object which object to follow, in the actual game, it will be the player
Enemy.prototype.assignplayer = function(player) {
	this.player = player;
};

//Update the enemy's position
Enemy.prototype.update = function(planet, ctx, earray) {
	if(! (this.player === undefined) && this.alive){ //only update if alive
		this.count = (this.count+1) % this.rof; //update counter
		ctx = ctx;
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

		////////SHOOTING////////
		if (this.count == this.trigger && this.player.name !== "Planet") { //don't shoot if orbiting the planet
			if (this.isboss) {
				var bullet = new Bullet(this.x, this.y, 6, toPlayerX, toPlayerY, 8, 10, enemyTraits[this.type].bulletColor, Options.planType, this, false, this.damage, 0);
			} else {
				var bullet = new Bullet(this.x, this.y, 3, toPlayerX, toPlayerY, 8, 10, enemyTraits[this.type].bulletColor, Options.planType, this, false, this.damage, 0);
			}
			var shoot = new Audio();
			shoot.src = jsfxr(sounds[this.type].shoot);
			shoot.volume = Options.volume;
			shoot.play();
			shoot.addEventListener('ended', function() {
			    delete shoot;
			}, false);
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
			if (this.type === "fire") {
				if (this.pBullets[i].type === "fire") {
					this.damagemult = 1;
				} else if (this.pBullets[i].type === "air") {
					this.damagemult = 1.5;
				} else if (this.pBullets[i].type === "water") {
					this.damagemult = 0.5;
				} else if (this.pBullets[i].type === "rock") {
					this.damagemult = 1;
				}
			} else if (this.type === "air") {
				if (this.pBullets[i].type === "fire") {
					this.damagemult = 0.5;
				} else if (this.pBullets[i].type === "air") {
					this.damagemult = 1;
				} else if (this.pBullets[i].type === "water") {
					this.damagemult = 1;
				} else if (this.pBullets[i].type === "rock") {
					this.damagemult = 1.5;
				}
			} else if (this.type === "water") {
				if (this.pBullets[i].type === "fire") {
					this.damagemult = 1.5;
				} else if (this.pBullets[i].type === "air") {
					this.damagemult = 1;
				} else if (this.pBullets[i].type === "water") {
					this.damagemult = 1;
				} else if (this.pBullets[i].type === "rock") {
					this.damagemult = 0.5;
				};
			} else if (this.type === "rock") {
				if (this.pBullets[i].type === "fire") {
					this.damagemult = 1;
				} else if (this.pBullets[i].type === "air") {
					this.damagemult = 0.5;
				} else if (this.pBullets[i].type === "water") {
					this.damagemult = 1.5;
				} else if (this.pBullets[i].type === "rock") {
					this.damagemult = 1;
				};
			}
			if (this.pBullets[i].alive && collision(this,this.pBullets[i]) && this.health > 0) {
				if (!this.pBullets[i].penetrate) {
					this.pBullets[i].alive = false;
					this.health -= wepTraits[Options.wepType].damage * this.damagemult;
				} else if (this.pBullets[i].penetrate && this !== this.pBullets[i].currentenemy) {
					this.pBullets[i].currentenemy = this;
					this.pBullets[i].penetratecount += 1;
					this.health -= wepTraits[Options.wepType].damage * this.damagemult;
				}
				if(Options.wepType === "water" || powerups.splash){
					enemies.forEach(function(enemy){
						if(!(enemy === this)){
							if(distance(this.x, this.y, enemy.x, enemy.y) <= 250){
								enemy.health -= wepTraits[Options.wepType].damage * this.damagemult;
								var splashnoise = new Audio();
								splashnoise.src = jsfxr(sounds.water.death);
								splashnoise.volume = Options.volume;
								splashnoise.play();
								splashnoise.addEventListener('ended', function() {
								    delete splashnoise;
								}, false);
								ctx.save();
								ctx.translate(this.x, this.y);
								ctx.rotate(this.rotation);
								ctx.drawImage(enemyTraits.water.boom,-24,-24,48,48);
								ctx.restore();
							}
						}
					});
				}
				if (Options.wepType === "air") {
					this.angle = Math.atan2(toPlayerY, toPlayerX)+Math.PI;
					this.x -= toPlayerX * this.speed * 30;
					this.y -= toPlayerY * this.speed * 30;
				}
				var hit = new Audio();
				hit.src = jsfxr(sounds[this.type].hit);
				hit.volume = Options.volume;
				hit.play();
				hit.addEventListener('ended', function() {
				    delete hit;
				}, false);
			} else if (this.pBullets[i].alive && collision(this,this.pBullets[i])) { //if it collides with a bullet, kill itself and the bullet
				this.alive = false;
				enemiesKilled += 1;
				this.explode = 1; //draw explosion sprite
				var eDeath = new Audio();
				eDeath.src = jsfxr(sounds[this.type].death);
				eDeath.volume = Options.volume;
				eDeath.play();
				eDeath.addEventListener('ended', function() {
				    delete eDeath;
				}, false);
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

//Init the player/turret
Turret = function (x,y,name, eArrays, eBullets, powerups) {
	this.x = x; 
	this.y = y;
	this.speed = 200;
	this.health = 500; //balance parameter
	this.shield = 200;
	this.direction = 0; //radians
	this.name = name;
	this.dmgcount = 0; //count for timing since last damaged, will be used for regenerating shield
	this.powerups = powerups;

	this.radius = 40;
	this.eArrays = eArrays; //array of enemy arrays 
	this.eBullets = eBullets;
	this.alive = true;
	this.regen = false;

};

Turret.prototype.checkCollision = function (enemyArray, isbullet, ispowerup) {
	for (var i = 0; i < enemyArray.length; i++) {
		if (ispowerup) {
			var pickup = new Audio();
			pickup.src = jsfxr(sounds.powerup.trishot);
			pickup.volume = Options.volume;
			pickup.play();
			pickup.addEventListener('ended', function() {
			    delete pickup;
			}, false);
		} else {
			if (enemyArray[i].alive && collision(this,enemyArray[i])) {
				if (this.shield > 0) {
					if (isbullet) {
						this.shield -= 20;
					} else {
						this.shield -= enemyArray[i].damage;
					}
					if (!this.regen) {
						this.dmgcount = 120;
					}
					var hit = new Audio();
					hit.src = jsfxr(sounds.player.hit);
					hit.volume = Options.volume;
					hit.play();
					hit.addEventListener('ended', function() {
					    delete hit;
					}, false);
				} else if (this.shield <= 0 && this.health > 0) {
					if (isbullet) {
						this.health -= 20;
					} else {
						this.health -= enemyArray[i].damage;
					}
					var hit = new Audio();
					hit.src = jsfxr(sounds.player.hit);
					hit.volume = Options.volume;
					hit.play();
					hit.addEventListener('ended', function() {
					    delete hit;
					}, false);
				} else if (this.shield <= 0 && this.health <= 0) {
					var death = new Audio();
					death.src = jsfxr(sounds.player.death);
					death.volume = Options.volume;
					death.play();
					death.addEventListener('ended', function() {
					    delete death;
					}, false);
				}
				if (enemyArray[i].name === "bullet") {
					enemyArray[i].alive = false;
				}
			}
		}
	}
}

Turret.prototype.update = function (delta, gc) { //call this to update properties and draw
	//keyboard handlers
	if (65 in keysDown) { //left
		if (this.x > 0) {
			this.x -= this.speed * delta;
		} else {
			this.x = gc.width;
		}
	}
	if (87 in keysDown) { //up
		if (this.y > 0) {
			this.y -= this.speed * delta;
		} else {
			this.y = gc.height;
		}
	}
	if (68 in keysDown) { //right
		if (this.x < gc.width) {
			this.x += this.speed * delta;
		} else {
			this.x = 0;
		}
	}
	if (83 in keysDown) { //down
		if (this.y < gc.height) {
			this.y += this.speed * delta;
		} else {
			this.y = 0;
		}
	}
	var dDir = this.findDirection(mouseX,mouseY); //delta in direction

	//collision
	for (var i = 0; i < this.eArrays.length; i++) {
		this.checkCollision(this.eArrays[i], false, false);
	}
	this.checkCollision(this.eBullets, true, false);
	this.checkCollision(this.powerups, false, true);


	//damage-related stuff

	if (this.dmgcount > 0) {
		this.dmgcount--;
	}

	if (this.shield < 200 && this.shield >=0 && this.dmgcount == 0) {
		this.shield += 0.25; //shield will regenerate very slowly
		this.regen = false;
	}
	if (this.shield > 0) {
		this.radius = 40;
	}

	if (this.shield <= 0) {
		this.radius = 10; //collision detection radius set to 40 (shield), reduced when shield is 
	}
	if (this.shield < 0) {
		this.shield = 0;
		this.dmgcount = 540;
		this.regen = true;
	}

	if (this.health < 0) {
		this.health = 0;
		this.alive = false;
	}

	this.direction += dDir;
};

Turret.prototype.draw = function (ctx) { 
	if (this.alive) {
		ctx.save(); //save the state to stack before rotating
		ctx.translate(this.x,this.y);
		ctx.rotate(this.direction);

		//draw shield
		var shieldColor = "#"; 
		for (var i = 0; i < 3; i++) {
			shieldColor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		ctx.beginPath();
		ctx.arc(0, 0, 40, 0, 2 * Math.PI, false);
		ctx.lineWidth = 4;
		ctx.strokeStyle = shieldColor;//rgb(Math.floor(100 + 70*Math.random()),Math.floor(100 + 70*Math.random()),Math.floor(100 + 70*Math.random()));
		if (this.shield > 0) { //only draw if greater than 0
			ctx.stroke(); 
		}
		ctx.closePath();	

		ctx.drawImage(sprite_player,-12,-12);
		ctx.restore(); //restore back to original
	}
};

Turret.prototype.findDirection = function (mX,mY) {
	var distanceX = this.x - mX;
	var distanceY = this.y - mY;
	var newDir = Math.atan2(distanceY,distanceX); //find angle from arctangent
	var dDir = newDir - this.direction; //delta in direction
	return dDir;
};

Planet = function(x, y, name, color, stroke, bullets) {
	this.x = x;
	this.y = y;
	this.health = 5000;
	this.shield = 3000;
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
		if (this.type === "fire") {
			if (this.pBullets[i].type === "fire") {
				this.damagemult = 1;
			} else if (this.pBullets[i].type === "air") {
				this.damagemult = 1.5;
			} else if (this.pBullets[i].type === "water") {
				this.damagemult = 0.5;
			} else if (this.pBullets[i].type === "rock") {
				this.damagemult = 1;
			};
		} else if (this.type === "air") {
			if (this.pBullets[i].type === "fire") {
				this.damagemult = 0.5;
			} else if (this.pBullets[i].type === "air") {
				this.damagemult = 1;
			} else if (this.pBullets[i].type === "water") {
				this.damagemult = 1;
			} else if (this.pBullets[i].type === "rock") {
				this.damagemult = 1.5;
			};
		} else if (this.type === "water") {
			if (this.pBullets[i].type === "fire") {
				this.damagemult = 1.5;
			} else if (this.pBullets[i].type === "air") {
				this.damagemult = 1;
			} else if (this.pBullets[i].type === "water") {
				this.damagemult = 1;
			} else if (this.pBullets[i].type === "rock") {
				this.damagemult = 0.5;
			};
		} else if (this.type === "rock") {
			if (this.pBullets[i].type === "fire") {
				this.damagemult = 1;
			} else if (this.pBullets[i].type === "air") {
				this.damagemult = 0.5;
			} else if (this.pBullets[i].type === "water") {
				this.damagemult = 1.5;
			} else if (this.pBullets[i].type === "rock") {
				this.damagemult = 1;
			};
		};
		if (this.bullets[i].alive && collision(this,this.bullets[i]) && this.shield > 0) {
			this.shield -= wepTraits[Options.wepType].damage * this.damagemult;
			this.totaldamage += wepTraits[Options.wepType].damage * this.damagemult;
			if (!this.regen) {
				this.dmgcount = 180;
			}
			this.bullets[i].alive = false;
			var hit = new Audio();
			hit.src = jsfxr(sounds.planet.hit);
			hit.volume = Options.volume;
			hit.play();
			hit.addEventListener('ended', function() {
			    delete hit;
			}, false);
		} else if (this.bullets[i].alive && collision(this,this.bullets[i]) && this.health > 0) {
			this.radius = 70;
			this.health -= wepTraits[Options.wepType].damage * this.damagemult;
			this.totaldamage += wepTraits[Options.wepType].damage * this.damagemult;
			this.bullets[i].alive = false;
			var hit = new Audio();
			hit.src = jsfxr(sounds.planet.hit);
			hit.volume = Options.volume;
			hit.play();
			hit.addEventListener('ended', function() {
			    delete hit;
			}, false);
		} else if (this.bullets[i].alive && collision(this,this.bullets[i])) { //if it collides with a bullet, kill itself and the bullet
			this.bullets[i].alive = false;
			this.alive = false;
			var death = new Audio();
			death.src = jsfxr(sounds.planet.death);
			death.volume = Options.volume;
			death.play();
			death.addEventListener('ended', function() {
			    delete death;
			}, false);
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

Star = function(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
}

Star.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.color;
	ctx.fill();
}

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
			ctx.fillRect(this.owner.x - 55, this.owner.y - 45, 100 * this.healthpercent, 5);
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
				ctx.fillRect(this.owner.x - 55, this.owner.y - 35, 100 * this.shieldpercent, 5);
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
				var shielddown = new Audio();
				shielddown.src = jsfxr(sounds.player.shielddown);
				shielddown.volume = Options.volume;
				shielddown.play();
				shielddown.addEventListener('ended', function() {
				    delete shielddown;
				}, false);
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

Bullet = function(x, y, r, dx, dy, speed, damage, color, type, owner, playershot, damage, offset) {
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
	this.damage = damage;

	this.alive = true; //Used for determining damage and whether to draw
	this.owner = owner;
	this.playershot = playershot;

	this.rotation = 0;
	this.penetratecount = 0;
	this.currentenemy = 0;
	this.penetrate = false;
	this.offset = offset;

	this.type = type;
	if ((this.type === "rock" || powerups.penetrate) && this.playershot) {
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
			if (this.offset > 0) {
				this.x += Math.cos(this.offset) * this.speed * this.dx;
				this.y += Math.sin(this.offset) * this.speed * this.dy;
			} else {
				this.x += this.speed * this.dx;
				this.y += this.speed * this.dy;
			}
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

Powerup = function(x,y,type,array) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.name = "powerup";
	this.color = "white";
	if (this.type === "tri") {
		this.name = "TRISHOT";
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
	this.radius = 30;
	this.alive = true;
	this.powerups = array;
};

Powerup.prototype.update = function() {
	if (this.alive) {	
		this.x += 5;
		this.y += 6;
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
		ctx.fillText(this.name, this.x, this.y + 15);
		ctx.restore();
	}
}
/////////////////---------\\\\\\\\\\\\\\\\\\\\\\\\\\



//////////////// UTILITY FUNCTIONS//////////////////
//Commonly used stuff, such as finding distance
function distance (x1,y1,x2,y2) {
	dX2 = Math.pow((x2-x1),2);
	dY2 = Math.pow((y2-y1),2);
	return Math.sqrt(dX2 + dY2);
} 

function collision (a,b) {
	space = a.radius + b.radius;
	if (distance(a.x,a.y,b.x,b.y) < space) {
		return true; //collision
	}
	else {
		return false;
	}
}




///////////////// INIT FUNCTIONS \\\\\\\\\\\\\\\\\\\
//Inits the main menu, shows title and play button
function initMainMenu() {
	initStars();
	//This block initiliazes the mainmenu canvas, sets the context, and sets its width and height to that of the user's screen
	var canvas = document.getElementById('mainmenu');
	currentcanvas = 'mm';
	var ctx = canvas.getContext('2d');
	winwidth = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwidth;
	canvas.height = winheight;
	renderops.main = true;

	canvas.addEventListener("mousemove", function (e) {
		var rect = canvas.getBoundingClientRect(); //get bounding rectangle
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
	}, false);

	//Initialize Array of clickable elements, and then push in the parameters that would make a rectangle ***Note, this may be innefficient for just one element, consider revision
	var elements = [];
	elements.push({
		color: "red",
		width: 200,
		height: 75,
		top: winheight / 2 + 50,
		left: winwidth / 2 - 100
	});

	//Initialize click handler for start button. It checks every click on the canvas if it is in the bounds of any of the elements, in this case, the start button
	canvas.addEventListener('click', function(event) {
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		elements.forEach(function(element) {
			if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				renderops.main = false;
				clearScreen();
				var clicksnd = new Audio();
				clicksnd.src = jsfxr(sounds.click);
				clicksnd.volume = Options.volume;
				clicksnd.play();
				clicksnd.addEventListener('ended', function() {
				    delete clicksnd;
				}, false);
				initLevelSelect();
			}
		});
	}, false);

	var main = function(){
		if (renderops.main) {
			render();
			requestAnimationFrame(main);
		}
	};

	//clears the screen
	var clearScreen = function(){
		ctx.clearRect(0,0,canvas.width, canvas.height);
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		//Render the Title
		ctx.font = "30pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Earth Invader", winwidth / 2, 50);

		//render each object in elements as per parameters
		elements.forEach(function(element) {
			ctx.fillStyle = element.color;
			ctx.fillRect(element.left, element.top, element.width, element.height);
		});

		//render text on the start button
		ctx.fillStyle = "black";
		ctx.fillText("Start", winwidth / 2, winheight / 2 + 100);

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		ctx.fillStyle = cursorcolor;
		ctx.fillRect(mouseX + 1,mouseY + 4,2,8);
		ctx.fillRect(mouseX + 4,mouseY + 1,8,2);
		ctx.fillRect(mouseX + 1,mouseY - 8,2,8);
		ctx.fillRect(mouseX - 8,mouseY + 1,8,2);
	};

	main();
}

//Initialize the level select menu. So far, it is basically just a main menu again, nothing new.
function initLevelSelect() {
	var canvas = document.getElementById('levelselect');
	currentcanvas = 'ls';
	var ctx = canvas.getContext('2d');
	winwidth = document.documentElement.clientWidth;
	winheight = document.documentElement.clientHeight;
	canvas.width = winwidth;
	canvas.height = winheight;

	renderops.levelselect = true;
	var infoBox = "";

	canvas.addEventListener('click', function(event) {
		var cLeft = canvas.offsetLeft;
		var cTop = canvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		if (y > canvas.height - 150 && y < canvas.height - 150 + 75 && x > canvas.width / 2 - 100 && x < canvas.width / 2 - 100 + 200) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			renderops.levelselect = false;
			clearScreen();
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
			initGame();
		}

		if(y > 200 && y < 275 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			Options.planType = "fire";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}
		if(y > 200 && y < 275 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			Options.planType = "air";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}
		if(y > 200 && y < 275 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			Options.planType = "water";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();

		}
		if(y > 200 && y < 275 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			Options.planType = "rock";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}


		if(y > 400 && y < 475 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			Options.wepType = "fire";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}
		if(y > 400 && y < 475 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			Options.wepType = "air";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}
		if(y > 400 && y < 475 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			Options.wepType = "water";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}
		if(y > 400 && y < 475 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			Options.wepType = "rock";
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
		}
	}, false);
	canvas.addEventListener("mousemove", function (e) {
		var rect = canvas.getBoundingClientRect(); //get bounding rectangle
		x = e.clientX - rect.left;
		y = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets

		if(y > 200 && y < 275 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			infoBox = "Weak against Air, resistant to Water.";
		} else if(y > 200 && y < 275 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			infoBox = "Weak against Rock, resistant to Fire.";
		} else if(y > 200 && y < 275 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			infoBox = "Weak against Fire, resistant to Rock.";
		} else if(y > 200 && y < 275 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			infoBox = "Weak against Water, resistant to Air.";
		} else if(y > 400 && y < 475 && x > (canvas.width/4)/2+100 && x < (canvas.width/4)/2+100+200){
			infoBox = "Effective against Water, less effective against Air.";
		} else if(y > 400 && y < 475 && x > (canvas.width/2)-250 && x < (canvas.width/2)-250+200){
			infoBox = "Effective against Fire, less effective against Rock.";
		} else if(y > 400 && y < 475 && x > (canvas.width/2)+50 && x < (canvas.width/2)+50 + 200){
			infoBox = "Effective against Rock, less effective against Fire.";
		} else if(y > 400 && y < 475 && x > ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) && x < ((canvas.width/2) + 50) + ((canvas.width/2)-250)-((canvas.width/4)/2 + 100) + 200){
			infoBox = "Effective against Air, less effective against Water.";
		} else {
			infoBox = "Planet type: " + Options.planType + ". Weapon type: " + Options.wepType + ".";
		}
	}); 

	var main = function(){
		if (renderops.levelselect) {
			render();
			requestAnimationFrame(main);
		}
	};

	//clears the screen
	var clearScreen = function(){
		ctx.clearRect(0,0,canvas.width, canvas.height);
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		ctx.font = "30pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Level Select", winwidth / 2, 50);
		ctx.fillStyle = "green";
		ctx.fillRect(canvas.width / 2 - 100, canvas.height - 150, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Play", winwidth / 2, winheight - 100);

	//////////////////////////////////////////////////////////

		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Select a Planet Type", winwidth / 2, 150);

		ctx.fillStyle = "red";
		ctx.fillRect((canvas.width / 4) / 2 + 100, 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Fire", (canvas.width / 4) / 2 + 200, 250);
		if (Options.planType === "fire") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.fillStyle = "white";
		ctx.fillRect((canvas.width / 2) - 250, 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Air", (canvas.width / 2) - 150, 250);
		if (Options.planType === "air") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.fillStyle = "blue";
		ctx.fillRect((canvas.width / 2) + 50, 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Water", (canvas.width / 2) + 150, 250);
		if (Options.planType === "water") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.fillStyle = "brown";
		ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 200, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Rock", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 250);
		if (Options.planType === "rock") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

	/////////////////////////////////////////////////////////////

		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("Select a Weapon Type", winwidth / 2, 350);

		ctx.fillStyle = "red";
		ctx.fillRect((canvas.width / 4) / 2 + 100, 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Fire", (canvas.width / 4) / 2 + 200, 450);
		if (Options.wepType === "fire") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.fillStyle = "white";
		ctx.fillRect((canvas.width / 2) - 250, 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Air", (canvas.width / 2) - 150, 450);
		if (Options.wepType === "air") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.fillStyle = "blue";
		ctx.fillRect((canvas.width / 2) + 50, 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Water", (canvas.width / 2) + 150, 450);
		if (Options.wepType === "water") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.fillStyle = "brown";
		ctx.fillRect(((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100), 400, 200, 75);
		ctx.fillStyle = "black";
		ctx.fillText("Rock", ((canvas.width / 2) + 50) + ((canvas.width / 2) - 250) - ((canvas.width / 4) / 2 + 100) + 100, 450);
		if (Options.wepType === "rock") {
			ctx.strokeStyle == planTraits[Options.planType].planstroke;
			ctx.stroke();
		}

		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(infoBox, winwidth / 2, 525);

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		ctx.fillStyle = cursorcolor;
		ctx.fillRect(mouseX + 1,mouseY + 4,2,8);
		ctx.fillRect(mouseX + 4,mouseY + 1,8,2);
		ctx.fillRect(mouseX + 1,mouseY - 8,2,8);
		ctx.fillRect(mouseX - 8,mouseY + 1,8,2);
	};

	main();
}

function initStars() {
	var starcanvas = document.getElementById("stars");
	var starctx = starcanvas.getContext("2d");
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	starcanvas.width = clientWidth;
	starcanvas.height = clientHeight;
	var stars = [];
	var colors = ["blue", "white", "red", "yellow"]
	for (var y = 0; y < clientHeight; y += Math.round(Math.random() * 100) + 1) {
		for (var x = 0; x < clientWidth; x += Math.round(Math.random() * 100) + 1) {
			var color = colors[Math.round(Math.random() * 4)];
			var star = new Star(x, y, color);
			stars.push(star);
		};
	}
	for (var x = 0; x < clientWidth; x += Math.round(Math.random() * 100) + 1) {
		for (var y = 0; y < clientHeight; y += Math.round(Math.random() * 100) + 1) {
			var color = colors[Math.round(Math.random() * 4)];
			var star = new Star(x, y, color);
			stars.push(star);
		};
	} 
	render = function(){
		stars.forEach(function(star){
			star.draw(starctx)
		});
	};
	render();
}

//Because of issues with the files loading asynchronously and sometimes before the document was ready, I was forced to merge the three other files and encase them in an init function
function initGame() {
	var igc = document.createElement('canvas');
	igc.id = 'game';
	document.body.appendChild(igc);
	//Initialize the game canvas, get its context, and set its width and height to that of the screen
	var gamecanvas = document.getElementById("game");
	var gamectx = gamecanvas.getContext("2d");
	currentcanvas = 'gc';
	var clientWidth = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	gamecanvas.width = clientWidth;
	gamecanvas.height = clientHeight;
	var halfwidth = gamecanvas.width / 2;
	var halfheight = gamecanvas.height / 2;
	var gameOver = false;
	var winGame = false;

	if (Options.planType === "fire") {
		if (Options.wepType === "fire") {
			scoremult = 1;
		} else if (Options.wepType === "air") {
			scoremult = 0.5;
		} else if (Options.wepType === "water") {
			scoremult = 1.5;
		} else if (Options.wepType === "rock") {
			scoremult = 1;
		};
	} else if (Options.planType === "air") {
		if (Options.wepType === "fire") {
			scoremult = 1.5;
		} else if (Options.wepType === "air") {
			scoremult = 1;
		} else if (Options.wepType === "water") {
			scoremult = 1;
		} else if (Options.wepType === "rock") {
			scoremult = 0.5;
		};
	} else if (Options.planType === "water") {
		if (Options.wepType === "fire") {
			scoremult = 0.5;
		} else if (Options.wepType === "air") {
			scoremult = 1;
		} else if (Options.wepType === "water") {
			scoremult = 1;
		} else if (Options.wepType === "rock") {
			scoremult = 1.5;
		};
	} else if (Options.planType === "rock") {
		if (Options.wepType === "fire") {
			scoremult = 1;
		} else if (Options.wepType === "air") {
			scoremult = 1.5;
		} else if (Options.wepType === "water") {
			scoremult = 0.5;
		} else if (Options.wepType === "rock") {
			scoremult = 1;
		};
	};

	//Variable to track if mouse is held down
	var mousedown = false;
	var firing = false;
	var shootcount = 0; //and how frequently to shoot
	var pBullets = [];
	var eBullets = [];
	var enemies = [];
	var defenders = [];
	var bossbars = [];
	var poweruparray = [];
	var poweruptimer = Math.floor(Math.random() * 30) + 30;
	var poweruptypes = ["tri", "fast", "splash", "penetrate", "health", "invincibility"];

	var planet = new Planet(halfwidth, halfheight, "Planet", planTraits[Options.planType].plancolor, planTraits[Options.planType].planstroke, pBullets);
	var planethealth = new Healthbar(clientWidth - 310, 10, planet, false);

	//Create a player, an enemy, and assign the player to enemy so that it will follow it
	var player = new Turret(halfwidth, 45, "Player", [enemies,defenders], eBullets, powerups);
	var playerhealth = new Healthbar(10, 10, player, false);

	var spawns = [[40, 40], [40, halfheight], [40, clientHeight], [halfwidth, 40], [halfwidth, clientHeight], [clientWidth - 40, 40], [clientWidth - 40, halfheight], [clientWidth - 40, clientHeight - 40]];
	var enemytypes = ["fire", "air", "water", "rock"];
	var enemycount = 1;
	var defendercount = 1;

	var makeEnemies = function(x,y, type) {
		var randOrbit = Math.round(Math.random()*20) + 60; //30 to 80
		var enemy = new Enemy(x, y, 10, 10, randOrbit, type, pBullets, eBullets, false);
		enemy.assignplayer(player);
		enemies.push(enemy);
		if (enemycount < 7) {
			setTimeout(function(){
				makeEnemies(x, y, type);
			}, 1000);
			enemycount += 1;
		}
	};
	var makeBoss = function(x,y, type) {
		var randOrbit = Math.round(Math.random()*20) + 60; //30 to 80
		var boss = new Enemy(x, y, 30, 30, randOrbit, type, pBullets, eBullets, true);
		boss.assignplayer(player);
		var bosshealth = new Healthbar(x, y, boss, true);
		bossbars.push(bosshealth);
		enemies.push(boss);
	};
	var makeDefenders = function(x,y, type) {
		var randOrbit = Math.round(Math.random()*20) + 80; //40 to 90
		var enemy = new Enemy(x, y, 10, 10, randOrbit, type, pBullets, eBullets, false);
		enemy.assignplayer(planet);
		defenders.push(enemy);
		if (defendercount < 14) {
			setTimeout(function(){
				makeDefenders(x, y, type);
			}, 1000);
			defendercount += 1;
		}
	};

////////////////////////////////////////
/// Handlers

	gamecanvas.addEventListener('mousedown', function (e) {
		mousedown = true; //set to 0, thus starting count
		//shootcount = 0;
	}, false);
	gamecanvas.addEventListener('mouseup', function (e) {
		mousedown = false;
	}, false);
	gamecanvas.addEventListener("mousemove", function (e) {
		var rect = gamecanvas.getBoundingClientRect(); //get bounding rectangle
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top; //clientX & Y are for whole window, left and top are offsets
	}, false);
	window.addEventListener('keydown', function (e) {
		keysDown[e.keyCode] = true;
	}, false);
	window.addEventListener('keyup', function(e) {
		delete keysDown[e.keyCode];
		if (e.keyCode === 80 && paused) {
			paused = false;
		} else if (e.keyCode === 80 && !paused) {
			paused = true;
		}
		if (e.keyCode === 77 && muted) {
			muted = false;
		} else if (e.keyCode === 77 && !muted) {
			muted = true;
		}
	}, false);

/////////////////////////////////////////

	timer = 3;
	setTimeout(function(){
		timer = 2;
		var clicksnd = new Audio();
		clicksnd.src = jsfxr(sounds.click);
		clicksnd.volume = Options.volume;
		clicksnd.play();
		clicksnd.addEventListener('ended', function() {
		    delete clicksnd;
		}, false);
		setTimeout(function(){
			timer = 1;
			var clicksnd = new Audio();
			clicksnd.src = jsfxr(sounds.click);
			clicksnd.volume = Options.volume;
			clicksnd.play();
			clicksnd.addEventListener('ended', function() {
			    delete clicksnd;
			}, false);
			setTimeout(function(){
				starting = false;
				var clicksnd = new Audio();
				clicksnd.src = jsfxr(sounds.click);
				clicksnd.volume = Options.volume;
				clicksnd.play();
				clicksnd.addEventListener('ended', function() {
				    delete clicksnd;
				}, false);
				makeEnemies(halfwidth, halfheight + 100, Options.planType);
				makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, Options.planType);
			}, 1000);
		}, 1000);
	}, 1000);

	powerups.fastshot.nrof = wepTraits[Options.wepType].rof;

	//main game loop, updates and renders the game
	var main = function(){
		var now = Date.now();
		var delta = now - then;

		if (!gameOver) {
			update(delta / 1000);
			render();			
		} else if (gameOver && winGame) {
			gameoverscreen(true);
		} else if (gameOver && !winGame) {
			gameoverscreen(false);
		}

		then = now;

		requestAnimationFrame(main);
	};

	//updates the positions of the player and enemy
	var update = function(delta){
		if (!starting) {
			if (!paused) {
				if (powerups.fastshot.toggle) {
					wepTraits[Options.wepType].rof = powerups.fastshot.frof;
				}
				//first, decide if new bullet should be added
				if (mousedown) {
					shootcount++;
		 			
		 			if (shootcount % wepTraits[Options.wepType].rof == 1) { //use rate of fire property as modulo, fire every <rof> frames
		 				var dx = mouseX - player.x; //use the global variables!
						var dy = mouseY - player.y ;
						var distanceToPlayer = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
						var angle = Math.atan2(dy, dx);
						var pangle = Math.atan2(mouseY, mouseX);

						var bullet = new Bullet(player.x, player.y, 3, dx/distanceToPlayer, dy/distanceToPlayer, wepTraits[Options.wepType].speed, wepTraits[Options.wepType].damage, wepTraits[Options.wepType].color, Options.wepType, player, true, wepTraits[Options.wepType].damage, 0);
						if (Options.wepType === "air" || powerups.trishot) {
							for (var i = 0; i < 3; i++) {
								var test = angle + pangle + -0.5 + (i * 0.25);
								console.log("Angle: " + test);
								var bullet = new Bullet(player.x, player.y, 3, dx/distanceToPlayer, dy/distanceToPlayer, wepTraits[Options.wepType].speed, wepTraits[Options.wepType].damage, wepTraits[Options.wepType].color, Options.wepType, player, true, wepTraits[Options.wepType].damage, test);
								pBullets.push(bullet);
							}
						}
						var lasersnd = new Audio();
						lasersnd.src = jsfxr(sounds.player[Options.wepType]);
						lasersnd.volume = Options.volume;
						lasersnd.play();
						lasersnd.addEventListener('ended', function() {
						    delete lasersnd;
						}, false);
						pBullets.push(bullet);

		 			} 
				}

				enemies.forEach(function(enemy){
					enemy.update(planet, gamectx, enemies);
				});
				defenders.forEach(function(enemy){
					enemy.update(planet, gamectx, defenders);
				});	
				pBullets.forEach(function(bullet){
					bullet.update(pBullets);
				});
				eBullets.forEach(function(bullet){
					bullet.update(eBullets);
				});
				bossbars.forEach(function(bar){
					bar.update();
				});

				player.update(delta, gamecanvas);
				playerhealth.update();
				planethealth.update();
				planet.update();

				if (((Date.now() - wave) / 1000) > 15) {
					wave = Date.now();
					if (enemies.length < 100) {
						enemycount = 1;
						var randomint = Math.floor(Math.random() * 8);
						makeEnemies(spawns[randomint][0], spawns[randomint][1], enemytypes[Math.floor(Math.random() * 4)]);
					}
					if (defenders.length < 14) {
						defendercount = 15 - defenders.length; //15 as 14 + 1, to make sure that it spawns in case there are 0 defenders
						makeDefenders(clientWidth / 2 - 40, clientHeight / 2 - 40, Options.planType);
					}
				};
				if (((Date.now() - boss) / 1000) > 60) {
					boss = Date.now();
					var randomint = Math.floor(Math.random() * 8);
					makeBoss(spawns[randomint][0], spawns[randomint][1], enemytypes[Math.floor(Math.random() * 4)]);
				};

				if (planet.health <= 0) {
					gameOver = true;
					winGame = true;
				}
				if (player.health <= 0) {
					player.alive = false;
					gameOver = true;
				};
				if (Date.now() - lastpowerup > poweruptimer) {
					var int = Math.floor(Math.random() * 5);
					var powerup = new Powerup(Math.floor(Math.random() * winwidth)+1,Math.floor(Math.random() * winheight)+1,poweruptypes[int],poweruparray);
					poweruparray.push(powerup);
				}
				time = Math.floor((Date.now() - start) / 1000);
				score = Math.round((((enemiesKilled * planet.totaldamage) / time) * 10) * scoremult);
			}
		}
		if (muted) {
			Options.volume = 0;
		} else if (!muted) {
			Options.volume = normvol;
		}
	};

	//clears the screen
	var clearScreen = function(){
		gamectx.clearRect(0,0,gamecanvas.width, gamecanvas.height);
	};

	//clears the screen, and redraws the objects
	var render = function(){
		clearScreen();

		planet.draw(gamectx);
		enemies.forEach(function(enemy){
			enemy.draw(gamectx, enemies);
		});
		defenders.forEach(function(enemy){
			enemy.draw(gamectx, defenders);
		});
		bossbars.forEach(function(bar){
			bar.draw(gamectx);
		});
		playerhealth.draw(gamectx);
		planethealth.draw(gamectx);
		gamectx.font = "20pt Arial";
		gamectx.fillStyle = "white";
		gamectx.textAlign = "center";
		gamectx.fillText(time, winwidth / 2, 30);
		player.draw(gamectx);
		pBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});
		eBullets.forEach(function(bullet){
			bullet.draw(gamectx);
		});

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		gamectx.fillStyle = cursorcolor;
		gamectx.fillRect(mouseX + 1,mouseY + 4,2,8);
		gamectx.fillRect(mouseX + 4,mouseY + 1,8,2);
		gamectx.fillRect(mouseX + 1,mouseY - 10,2,8);
		gamectx.fillRect(mouseX - 10,mouseY + 1,8,2);
		if (paused) {
			gamectx.font = "100pt Impact";
			gamectx.fillStyle = "green";
			gamectx.textAlign = "center";
			gamectx.fillText("Paused", winwidth / 2, winheight / 2);
		}
		if (starting) {
			gamectx.font = "100pt Impact";
			gamectx.fillStyle = "white";
			gamectx.textAlign = "center";
			gamectx.fillText(timer, winwidth / 2, winheight / 2);
		}
		if (muted) {
			gamectx.font = "20pt Impact";
			gamectx.fillStyle = "red";
			gamectx.textAlign = "right";
			gamectx.fillText("Muted", winwidth - 5, winheight - 5);
		}
	};

	var gameoverscreen = function(didwin){
		clearScreen();
		if (score > highscore) {
			highscore = score;
			localStorage.setItem("highscore", JSON.stringify(highscore));
		}

		gamectx.font = "100pt Impact";
		if (didwin) {
			gamectx.fillStyle = "green";
			gamectx.textAlign = "center";
			gamectx.fillText("You Win!", winwidth / 2, winheight / 2);
		} else if (!didwin) {
			gamectx.fillStyle = "red";
			gamectx.textAlign = "center";
			gamectx.fillText("Game Over!", winwidth / 2, winheight / 2);
		}

		gamectx.font = "75pt Impact";
		gamectx.fillText("Score: " + score, winwidth / 2, (winheight / 2) + 110);

		gamectx.font = "30pt Impact";
		gamectx.fillText("Highscore: " + highscore, winwidth / 2, (winheight / 2) + 150);
		gamectx.fillText("Time: " + time + " seconds", winwidth / 2, (winheight / 2) + 185);
		gamectx.fillText("Enemies Killed: " + enemiesKilled, winwidth / 2, (winheight / 2) + 220);

		gamectx.font = "30pt Arial";
		gamectx.fillStyle = "green";
		gamectx.fillRect(gamecanvas.width / 2 - 100, gamecanvas.height - 150, 200, 75);
		gamectx.fillStyle = "black";
		gamectx.fillText("Replay", winwidth / 2, winheight - 100);

		var cursorcolor = "#"; 
		for (var i = 0; i < 3; i++) {
			cursorcolor += (Math.floor(Math.random()*200)+55).toString(16); //keeping individual RGB values between 100 and 200, just b/c
		}
		gamectx.fillStyle = cursorcolor;
		gamectx.fillRect(mouseX + 1,mouseY + 4,2,8);
		gamectx.fillRect(mouseX + 4,mouseY + 1,8,2);
		gamectx.fillRect(mouseX + 1,mouseY - 10,2,8);
		gamectx.fillRect(mouseX - 10,mouseY + 1,8,2);

	};

	gamecanvas.addEventListener('click', function(event) {
		var cLeft = gamecanvas.offsetLeft;
		var cTop = gamecanvas.offsetTop;
		var x = event.pageX - cLeft;
		var y = event.pageY - cTop;

		if (y > gamecanvas.height - 150 && y < gamecanvas.height - 150 + 75 && x > gamecanvas.width / 2 - 100 && x < gamecanvas.width / 2 - 100 + 200 && gameOver) {
			gamectx.clearRect(0, 0, gamecanvas.width, gamecanvas.height);
			gameOver = false;
			winGame = false;
			for (x in enemies) {
				//delete enemies[x];
				var index = enemies.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in defenders) {
				//delete defenders[x];
				var index = defenders.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in pBullets) {
				//delete pBullets[x];
				var index = pBullets.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in eBullets) {
				//delete eBullets[x];
				var index = eBullets.indexOf(x);
				enemies.splice(index,1);
			}
			for (x in bossbars) {
				//delete bossbars[x];
				var index = bossbars.indexOf(x);
				enemies.splice(index,1);
			}
			planet.alive = false;
			player.alive = false;
			delete player;
			delete planet;
			renderops.game = false;
			document.body.removeChild(igc);
			starting = true;
			time = 0;
			initLevelSelect();
		}
	}, false);

	//updates the time, runs the main loop
	var then = Date.now();
	var start = Date.now();
	var wave = Date.now();
	var boss = Date.now();
	var lastpowerup = Date.now();
	main();
}
/////////////////----------------\\\\\\\\\\\\\\\\\\\

///////////////// MISCELLANEOUS \\\\\\\\\\\\\\\\\\\\
function resize() {
	if (currentcanvas === 'mm') {
		initMainMenu();
	} else if (currentcanvas === 'ls') {
		initLevelSelect();
	} else if (currentcanvas === 'gc') {
		initGame();
	}
}
/////////////////---------------\\\\\\\\\\\\\\\\\\\\