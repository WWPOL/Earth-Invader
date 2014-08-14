var canvas = document.getElementById('mainmenu');

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = "20pt Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Earth Invader", 150, 50);
	ctx.fillText("Start", 150, 125);
} else {
	alert("Your browser doesn't support canvas!");
}