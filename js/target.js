Target = function(x, y){
	this.x = x;
	this.y = y;
	this.speed = 500;
};

Target.prototype.update = function(delta) {
    if (37 in keysDown) { //left
        this.x -= this.speed * delta;
    }
    if (38 in keysDown) { //up
        this.y -= this.speed * delta;
    }
    if (39 in keysDown) { //right
        this.x += this.speed * delta;
    }
    if (40 in keysDown) { //down
        this.y += this.speed * delta;
    }

};

Target.prototype.render = function() {
	gctx.beginPath();
	gctx.fillStyle = "green";
	gctx.fillRect(this.x, this.y, 20, 20);
	gctx.stroke();
};