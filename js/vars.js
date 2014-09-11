///////////////// GLOBAL VARIABLES \\\\\\\\\\\\\\\\\
var currentcanvas;
var keysDown = {};
var mouseX = 0; //global mouse coords
var mouseY = 0;
var soundarray = [];

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

sprite_player.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAA+VBMVEUAAAAaGRZBQDsiIRoyMS0REAxUT0pKSUM+OzYsKiUpJx/oPxFmYFgWFhLrNgd3dHF3aGBXVVHUy0egiVNbUEfHnDtoQDGvSiyEPyqFKBXAMBHyPA7SNQ769tqBfnzW0G5oZV9+XlJtUkV9d0OYTDmSSC5FQiBPTR85NxwiIBDeNAiJg4CDc2+Tg2LKxFt0YFlfWVTAl1CwllCPe1DIoE3Gt0hwajhWPTLKSSdgXCCyPR2VOBx1bhuSihqoNRpUJhTgPxMCAgL8+vLx77/587OEaVqWbFmubkysXEpeXEB8Uj3KkzrToTLisy6fmCdsLxyvlhe8sxH0Iw3AHj8YAAAAAXRSTlMAQObYZgAAAR9JREFUKM+l0WlXglAQBmDvwr2XC7ggASqm7Eilpqm5ZNm+b///xxQWUVSffD/Oc2bOmZnCpin+U5ekE0n6o75/eavrpu/ZeTjYkyljEFba27+AMBEzSPulnR+jhjLFCAGRMSp/p61hf6UAgFDSpcnl6y+palARQDQNowhPljrxUhhDzAEK3FbrMeRPljkx14s1hA5QgKJ0pq3mmXp0XKvP58s4kdcHVUiiuN3Tpvpcq8eWZcXFj56AcwDAzah5vu7xzVl6ppFLMUdo0VVfQrFWnDlGKoVBj0AR8fEiELFe9+zDbJ9qOSGAuMiI07tIJKMKBCsBQ1ppl3Yz+CSEaQK5k94PyppGCJFTyHJ3ZRiG79jZqCwN6f2r+WJqhQ3zBgiwHGmiI+BQAAAAAElFTkSuQmCC';
sprite_fire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAJ1BMVEUAAAD/kwD/fwD/nQD/xgD/vgD/0wD/hwD/6AD/swD/qAD/3AD/dwDjrSRSAAAAAXRSTlMAQObYZgAAAFhJREFUCNdjYGAwzWAAAkH1sB0MDOxKxlOzGxiYziiudNvAYHSo0HhKBoO6sqDVEm+GQ4LCUqFuDEZKhZJAilGwfOqUBAZ2ReGV3g1A7VIhO0DGWHkwMAAAMMMS9FP4uwAAAAAASUVORK5CYII=';
sprite_rock.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAG1BMVEUAAACDQBFvNw+WTBeKRBN2OxBiMQ6QSBVIJQ0e7G3aAAAAAXRSTlMAQObYZgAAAFRJREFUCB0FwUEKgCAQQNEPdgAVxf2ArhO7QBS0no7gIlwWdIbO3XtAawBtdRuYGjXMmCjiLIcvXRPPOb4cqDI+CSy+XDkxeelqMS6q3rCsLgG8O/zaXAvNfQ96oAAAAABJRU5ErkJggg==';
sprite_water.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAM1BMVEUAAACE0vsJgsETicYKebIgkswIfrsLdKoRgbo0oNdCqd46pd0disBXt+cwnNN8zvdtxfMmMafIAAAAAnRSTlMAEoUqvHAAAABbSURBVAjXJY3JEcAwCAMdcxpf6b/aCLIv7YCggUdA+5mDeldfmUdQp67MDAlB5iVutYTM+52wzGp+7yZrJ/cNk6CcVNuJFKUjOAxVqzcwgH5aHBFxbsUTsur/B9V6As3dixo5AAAAAElFTkSuQmCC';
sprite_air.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMBAMAAACkW0HUAAAAJFBMVEUAAADs7Ozo5+fv7u7a1tbo5+fj39/d2trSzs7Iw8O7tbWsqKgpHvYvAAAAA3RSTlMAOSIhkgiAAAAAWklEQVQI12NgEDQOUWRgYAw1NvUUYFBNdynNWMigbGya4tLAYGxsbOrRxWBs4u7iMZshLL28pGM1SDCsYjYDq7GxWcUsBtGwFBePRQyM6cVmngoMDELGZkwMADJcE8vDAZzpAAAAAElFTkSuQmCC';
boom_fire.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAARVBMVEUAAAD/Og3/MQ7/dgP/kAP/agX/VQf/iAP/SQn/Owv/HRH/fgT/Swj/YQb/ZQX/hwD/Kw7/GRH/FBP/pwH/mwL/zAD/uQH8kbg4AAAAE3RSTlMABAr8/vv7/fn1E/7s+e4e8/EtiDeSTQAAAIJJREFUCB0FwYcBwzAMBLF7kupylZz9Rw0AuiS4pwEde54GMwN6DKzVpOpCrQqkw49ZkqUkoEsevt0DRM0Zj71iD3Fhp49Yv+8XnmQAp+/v+1bx1ABS2WutFV0XVtPwWCNK6RL5OO30neMYGWMCs6RWqLmDAa28dzLVbEjXna2/VQB/9KkFByfSWq4AAAAASUVORK5CYII=';
boom_rock.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAMFBMVEWLcw1+Zw6Cag9zXA6IcQ90XhB6Yw6ReQ1kTg9tVw9/aA9kThBnUQ+ZgA6Mcw+tkRcIyT11AAAADXRSTlMCCv4V/P39/fz69XzZbo3lQQAAAHJJREFUCNdjYGAQ4GIEkmILGZYwGDkycGgxqAMhA2PfgndsF4ASba6x6gxAYKkUe0+AgcHQSun9tam7Ge7evfv/ikoag2BH6/8nzMJAY/ruPgMZJOJaniooyMDgZFwgOpmRgSmRsUBgDjMDpwGzI+NURgDNzRvdY8ialAAAAABJRU5ErkJggg==';
boom_water.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAWlBMVEUAAAAwdcwxe84rgc4zdMwxh9A4jdMqe8w6ldYpd8tAoNocZsVIpt1DkdY5ktQxidE2kNQxf88veMw9itI3jNM4idEjbsg6jtNIoNo6mNdKs+AzjNJRvuREqtw2p81NAAAAGXRSTlMABw/7HP39/PPy/vIlFf3w9OmmUMGki2WIXxOO3gAAAIxJREFUCB0FwYUBwzAQALF7MIdTst3uv2YlEBfkkQUQRWJxYd8ElqzIFZ8rRwfP2cE/dq85iu71CYo+UuvzbbWs4O4vCzXYLywIR7AUbIwRb0UxC6HX73fEGexEWJr9xqgxWdkRtPU5e+xvREHalq40r213FF5bWrVMvfupsB5N8BKFJZ8CCiwlOKjIH6dABrw3FL34AAAAAElFTkSuQmCC';
boom_air.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAY1BMVEUAAADo4eHx7e3u5+fUy8vi2tra09PVysrv7Ozs5ubc09Pf2dnPxsbo4+PZ0tLw7u7CsrLi2dn08/PVzMzh29vn5OS/s7P+/Pzz8vLEtbXz8fHn4+PNwMDr5eXr4+P18vLd09OP7aMuAAAAHnRSTlMA/P7+Cf35+PTyR/X17u3bLxX15uO/hksf8eaglGdMQRepAAAAe0lEQVQIHQXBh0EDMRAAMJ3t7z2dBPzZf0okYNzuUJ7Ggld/w2tdvNfxUPpgn+Lp0y9j2Yds7zKs/XBta/r7nuBoI+ea4pxBeXRRa/1GB4+fuWuaFE1Oqbm6D0PUqLVmHNDWlM8zA0w1STmh4LcJtJcFzDGB2wUAhW3jH7FEBefzYq9lAAAAAElFTkSuQmCC';

/*
sprite_player.src = "../assets/Shooter.png";
sprite_fire.src = "../assets/Fire-Sprite.png";
sprite_rock.src = "../assets/Rock-Sprite.png";
sprite_water.src = "../assets/Water-Sprite.png";
sprite_air.src = "../assets/Air-Sprite.png";
boom_fire.src = "../assets/Fire-Boom.png";
boom_rock.src = "../assets/Rock-Boom.png";
boom_water.src = "../assets/Water-Boom.png";
boom_air.src = "../assets/Air-Boom.png";
*/
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
	multishot: {
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
/*
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
}*/

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

var mults = {
	fire: {
		waterdmg: 1.5,
		waterscore: 0.5,
		airdmg: 0.5,
		airscore: 1.5,
		firedmg: 1.0,
		firescore: 1.0,
		rockdmg: 1.0,
		rockscore: 1.0
	},
	air: {
		waterdmg: 1.0,
		waterscore: 1.0,
		airdmg: 1.0,
		airscore: 1.0,
		firedmg: 1.5,
		firescore: 0.5,
		rockdmg: 0.5,
		rockscore: 1.5
	},
	water: {
		waterdmg: 1.0,
		waterscore: 1.0,
		airdmg: 1.0,
		airscore: 1.0,
		firedmg: 0.5,
		firescore: 1.5,
		rockdmg: 1.5,
		rockscore: 0.5
	},
	rock: {
		waterdmg: 0.5,
		waterscore: 1.5,
		airdmg: 1.5,
		airscore: 0.5,
		firedmg: 1.0,
		firescore: 1.0,
		rockdmg: 1.0,
		rockscore: 1.0
	}
}
/////////////////------------------\\\\\\\\\\\\\\\\\