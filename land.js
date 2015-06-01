goog.provide('farming.Land');
goog.require('lime.Sprite');

/**
 * Land elements
 * Inherits from lime.Sprite, so behaves like a sprite
 *
 * @param {} gameObj
 */
farming.Land = function(gameObj, playerObj) {
	goog.base(this);
	this.setAnchorPoint(0, 0);
	this.setSize(gameObj.tile_size, gameObj.tile_size);
	this.setFill('images/bare_land.png');
	// sets default state as empty
	this.state = this.EMPTY;

	// event listener for clicking on land plots
	var land = this;
	// listens for both mouse clicks (mousedown) and touches (touchstart)
	goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
		e.event.stopPropagation();
		// if the land is empty, then clicking will plow land
		if(land.state == land.EMPTY && playerObj.money >= gameObj.costPlowing) {
			//plow land
			land.setFill('images/plowed.png')
			land.state = land.PLOWED;

			//update player money (it costs money to plow the land, cost set in gameObj)
			playerObj.money -= gameObj.costPlowing;
			gameObj.updateMoney();
		} else if(land.state == land.PLOWED && playerObj.money >= gameObj.crops[playerObj.currentCrop].cost) {
			//plant
			land.setFill('images/growing.png');
			land.state = land.GROWING;

			//store crop and left time for it to be ready and to die
			land.crop = playerObj.currentCrop;
			land.ripeTime = gameObj.crops[playerObj.currentCrop].time_to_ripe * 1000;
			land.deathTime = gameObj.crops[playerObj.currentCrop].time_to_death * 1000;

			//update player money
			playerObj.money -= gameObj.crops[playerObj.currentCrop].cost;
			gameObj.updateMoney();
		} else if(land.state == land.READY) {
			//harvest
			land.setFill('images/bare_land.png');
			land.state = land.EMPTY;
			console.log("Harvested! Gained $" + gameObj.crops[land.crop].revenue);

			//update player money
			playerObj.money += gameObj.crops[land.crop].revenue;
			gameObj.updateMoney();
		}
	});
	//growing plants
	// uses lime.js scheduler to keep track of how much time has passed and how long it takes for plants to ripen
	dt = 1000;
	lime.scheduleManager.scheduleWithDelay(function() {
		if(this.state == land.GROWING) {// if the plants are growing, check for when it is ripe
			if(this.ripeTime <= 0) {
				this.state = land.READY;
				this.setFill('images/' + gameObj.crops[this.crop].image);
			} else {
				// subtract time passed / update time left
				this.ripeTime -= dt;
				// how much time left until ripe?
				console.log(gameObj.crops[this.crop].name + " will be ripe in: " + this.ripeTime);
			}
		} else if(this.state == land.READY) {// once it's ripe, check if it has died yet
			if(this.deathTime <= 0) {
				this.state = land.EMPTY;
				// if it dies, replace with bare land again.
				this.setFill('images/bare_land.png');

			} else {
				// subtract time passed / update time left
				this.deathTime -= dt;
				// how much time left until death?
				console.log(gameObj.crops[this.crop].name + " will die in: " + this.deathTime);

			}
		}
	}, this, dt);
}

goog.inherits(farming.Land, lime.Sprite);

// type of land states
farming.Land.prototype.EMPTY = 0;
farming.Land.prototype.PLOWED = 1;
farming.Land.prototype.GROWING = 2;
// ready = harvest
farming.Land.prototype.READY = 3;
