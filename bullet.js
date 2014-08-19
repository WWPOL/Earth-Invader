//Init Bullet Class
Bullet = function(x, y, r, targetX, targetY, speed, damage, color) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.cx = x + (this.width/2);
	this.cy = y + (this.height/2);
	this.targetX = targetX;
	this.targetY = targetY;
	this.speed = speed; //constant that determines the velocity the bullet travels at
	this.damage = damage; //The damage the bullet does

	this.color = color;

	this.alive = true; //Used for determining damage and whether to draw

	this.dmgtick = 0; //Damage tick counter, used in Bullet.update() for determining damage

	this.rotation = 0;
};

//Update the bullet's position
Bullet.prototype.update = function(delta){

//Calculate direction to travel in order to reach point specified
var toTargetX = this.targetX - this.x;
var toTargetY = this.targetY = this.y;

//Normalize
var toTargetLength = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);
toTargetX = toTargetX / toTargetLength;
toTargetY = toTargetY / toTargetLength;

this.rotation = Math.atan2(toTargetY, toTargetX);

this.dmgtick = (this.dmgtick+1)%4; //apparently need to keep between 0 and 3

//Move towards targeted location
while(this.alive == true) {
	this.x += toTargetX * this.speed;
	this.y += toTargetX * this.speed;
}

};

//Draw the bullet object
Bullet.prototype.draw = function(ctx) {
	if (this.alive) { //only draw if alive
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fill();
		ctx.restore();
	}
};

/* TODO
-Collisions: Possibly make collisions a separate class since both bullet and enemy have to deal with collisions.
-Kill the bullet if it is off the canvas coordinates
-Integrate with the rest of the code 
*/
