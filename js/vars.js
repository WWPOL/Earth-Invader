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
	volume: 0.1
};

var powerups = {
	trishot: {
		toggle: false,
		timer: 1000
	},
	fastshot: {
		toggle: false,
		nrof: 15,
		frof: 7,
		timer: 1000
	},
	penetrate: {
		toggle: false,
		timer: 1000
	},
	splash: {
		toggle: false,
		timer: 1000
	},
	invincibility: {
		toggle: false,
		timer: 1000
	}
};

var normvol = Options.volume;

var sounds = {
	player: {
		fire: jsfxr([3,0.3758,0.0389,0.4992,0.56,0.5291,,,0.0115,0.1529,0.2918,-0.2967,-0.849,-0.2789,,-0.3001,-0.1337,0.4522,0.9619,0.0049,-0.543,0.0878,0.0741,0.5]),
		air: jsfxr([2,,0.242,,0.2856,0.5935,0.2,-0.1545,,,,,,0.4263,-0.3038,,,,1,,,0.1972,,0.5]),
		water: jsfxr([3,,0.14,0.5702,0.4047,0.97,,,,,,0.0856,0.7404,,,0.4366,,,1,,,,,0.5]),
		rock: jsfxr([2,,0.1486,0.0618,0.0313,0.3235,0.0103,-0.4143,,,,,,0.2042,0.1735,,,,1,,,,,0.5]),
		death: jsfxr([0,0.0344,0.2434,0.0007,0.6978,0.5593,,0.0009,-0.1852,0.188,,-0.8373,0.5945,-0.8342,-0.0007,,0.0003,-0.0709,0.9177,-0.1776,0.7897,,0.0001,0.5]),
		hit: jsfxr([1,,0.0125,,0.1674,0.6682,,-0.3997,,,,,,,,,,,1,,,,,0.5]),
		shielddown: jsfxr([3,,0.2837,0.5598,0.4561,0.0189,,,,,,,,,,,,,1,,,,,0.5]),
		shieldback: jsfxr([1,0.9203,0.7129,0.2955,0.369,0.5223,,-0.0713,0.1758,0.7845,0.9862,-0.968,-0.8643,0.7915,-0.0807,,-0.3867,-0.0029,0.9063,0.0015,,0.0282,-0.0049,0.5])
	},
	planet: {
		death: jsfxr([3,,0.2159,0.7801,0.97,0.07,,,,,,,0.89,,,,,0.32,0.79,,0.11,0.4,-0.36,0.5]),
		hit: jsfxr([3,,0.0112,,0.31,0.0875,,-0.0122,,,,0.422,0.8441,,,,0.1835,-0.0441,1,,,,,0.5])
	},
	fire: {
		hit: jsfxr([2,,0.011,,0.2299,0.6347,0.0408,-0.4464,0.2178,0.0469,0.0193,0.0419,0.0302,0.0684,0.0369,0.0177,-0.0717,0.0732,0.9868,-0.0122,0.0097,0.074,-0.0184,0.5]),
		shoot: jsfxr([1,,0.1636,0.2996,0.2184,0.5588,0.2816,-0.2181,,,,,,0.2688,0.0118,,0.1677,-0.0588,1,,,,,0.5]),
		death: jsfxr([3,,0.3766,0.2533,0.4427,0.1865,,-0.2766,,,,-0.2171,0.8871,,,0.7384,0.5009,-0.2509,1,,,,,0.5])
	},
	air: {
		hit: jsfxr([1,,0.0536,,0.2621,0.631,,-0.4006,,,,,,,,,,,1,,,,,0.5]),
		shoot: jsfxr([2,,0.1136,0.1444,0.3466,0.9639,0.2139,-0.2432,,,,,,0.8125,-0.3376,,,,1,,,0.2307,,0.5]),
		death: jsfxr([3,,0.2042,0.2207,0.4078,0.1535,,0.2536,,,,0.0739,0.7854,,,,-0.1692,-0.2249,1,,,,,0.5])
	},
	water: {
		hit: jsfxr([1,,0.01,,0.2682,0.7035,,-0.367,,,,,,,,,,,1,,,0.1467,,0.5]),
		shoot: jsfxr([0,,0.3498,,0.2535,0.3297,,0.2893,,,,,,0.0596,,,,,0.8007,,,0.0934,,0.5]),
		death: jsfxr([3,,0.3065,0.6898,0.3659,0.042,,0.2063,,,,-0.6731,0.6848,,,,,,1,,,,,0.5])
	},
	rock: {
		hit: jsfxr([3,,0.0129,,0.28,0.2587,,-0.5081,,,,,,,,,,,1,,,,,0.5]),
		shoot: jsfxr([2,0.0518,0.19,0.31,0.3405,0.3398,0.0424,-0.4251,0.0355,0.1033,0.1365,-0.0342,0.0407,0.0517,-0.0559,0.0628,0.3034,-0.2626,1,0.0017,0.0805,0.0027,-0.0163,0.5]),
		death: jsfxr([3,,0.2477,0.2528,0.4555,0.0385,,0.044,,,,-0.247,0.7443,,,,,,1,,,,,0.5])
	},
	powerup: jsfxr([0,0.0474,0.1545,0.4804,0.518,0.4414,0.1353,-0.0068,0.0824,,,-0.0384,0.0189,0.0616,0.0708,0.115,0.0828,0.0371,0.8901,-0.1333,0.0065,0.0344,0.0251,0.5]),
	click: jsfxr([0,,0.1601,,0.0198,0.586,,,,,,,,0.5755,,,,,1,,,0.1,,0.5])
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