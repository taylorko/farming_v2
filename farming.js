//set main namespace
goog.provide('farming');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
// Creates button
goog.require('lime.GlossyButton');

// links to land.js 's objects
goog.require('farming.Land');

// links to startPage.js eles
//goog.require('farming.Start');

//entrypoint
farming.start = function() {

	//game object
	// stores game level variables.  Will pass around object so properties can be accessed everywhere
	var gameObj = {
		width : 320,
		height : 480,
		tile_size : 64,
		num_tiles_x : 5,
		num_tiles_y : 6,
		landLayer_w : 64 * 5,
		landLayer_h : 64 * 6,
		controlsLayer_w : 64 * 5,
		controlsLayer_h : 64 * 1.5,
		startLayer_w: 64 * 5,
		startLayer_h: 64 * 6,
		costPlowing : 5,

		//shop
		shop_margin_x : 50,
		shop_margin_y : 20
	}

	// Obj to represent player. stores money and currently selected crop
	var playerObj = {
		money : 300,
		currentCrop : null
	}

	// -------------CROPS FOR SHOP ------------------
	// Obj stores crops available to purchase
	// easy to change parameters
	gameObj.crops = [{
		name : 'tomato',
		cost : 10, // cost to plant/purchase
		revenue : 18, // revenue gained when harvested
		time_to_ripe : 10, // in seconds
		time_to_death : 30, //time it takes to die after it's ripe (must harvest)
		image : 'tomato.png'
	}, {
		name : 'artichoke',
		cost : 20,
		revenue : 38,
		time_to_ripe : 60,
		time_to_death : 60,
		image : 'artichoke.png'
	}, {
		name : 'lettuce',
		cost : 15,
		revenue : 26,
		time_to_ripe : 30,
		time_to_death : 60,
		image : 'lettuce.png'
	}, {
		name : 'eggplant',
		cost : 30,
		revenue : 78,
		time_to_ripe : 120,
		time_to_death : 120,
		image : 'eggplant.png'
	}, {
		name : 'peppers',
		cost : 40,
		revenue : 82,
		time_to_ripe : 180,
		time_to_death : 180,
		image : 'peppers.png'
	}];

	// ------------ DIRECTORS ----------------
	// directors define which scenes are playing
	var director = new lime.Director(document.body, gameObj.width, gameObj.height);
	director.makeMobileWebAppCapable();
	director.setDisplayFPS(false);

	// -------------- S.1 START PAGE --------------
	// start page scene
	var startScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
	var startLayer = new lime.Layer().setAnchorPoint(0, 0);
	var startBackground = new lime.Sprite().setAnchorPoint(0, 0).setPosition(0, 0).setSize(gameObj.width, gameObj.height).setFill('#0D0D0D');
	startLayer.appendChild(startBackground);
	startScene.appendChild(startLayer);
	
	// -------------- S.2 START WELCOME AND LOGIN --------------
		var welcomeLabel = new lime.Label().setText('Welcome!').setFontColor('#fff').setPosition(gameObj.startLayer_w/2, gameObj.height - gameObj.startLayer_h/2-100);
	console.log("x position: " + gameObj.startLayer_w/2);
	console.log("y position: " + ((gameObj.height+gameObj.startLayer_h/2)-100));
	// the below code makes the welcomeLabel display on the scene
	startLayer.appendChild(welcomeLabel);
	
	// -------------- S.3 START LOGIN BUTTON --------------
	// Login button that takes player to landLayer
	var loginButton = new lime.GlossyButton().setColor('#133242').setText('Login').setPosition(gameObj.startLayer_w/2, gameObj.height - gameObj.startLayer_h/2+50).setSize(80, 40);
	startLayer.appendChild(loginButton);
	// listens for mouse clicks, launches shop event
	goog.events.listen(loginButton, ['mousedown', 'touchstart'], function(e) {
		director.replaceScene(gameScene);
	});

	
	
	// -------------- G.1 GAME/LAND LAYER --------------
	// once logged in, the game scene
	var gameScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
	// layer for crops
	var landLayer = new lime.Layer().setAnchorPoint(0, 0);
	// layer for settings and crops
	var controlsLayer = new lime.Layer().setAnchorPoint(0, 0);

	gameScene.appendChild(landLayer);
	gameScene.appendChild(controlsLayer);


	// -------------DISPLAY OF GAME EL (BUTTONS, MONEY, ETC)----------	

	//controls area
	var controlArea = new lime.Sprite().setAnchorPoint(0, 0).setPosition(0, gameObj.height - gameObj.controlsLayer_h).setSize(gameObj.controlsLayer_w, gameObj.controlsLayer_h).setFill('#0D0D0D')
	controlsLayer.appendChild(controlArea);

	//shop button
	var shopButton = new lime.GlossyButton().setColor('#133242').setText('Shop').setPosition(60, gameObj.height - gameObj.controlsLayer_h / 2).setSize(80, 40);
	controlsLayer.appendChild(shopButton);

	//money
	var moneyLabel = new lime.Label().setText('$' + playerObj.money).setFontColor('#E8FC08').setPosition(gameObj.controlsLayer_w - 50, gameObj.height - gameObj.controlsLayer_h / 2);
	controlsLayer.appendChild(moneyLabel);
	//updating money indicator
	gameObj.updateMoney = function() {
		moneyLabel.setText('$' + playerObj.money);
	};
	//create new land elements ( from land.js) for each game tile
	for(var i = 0; i < gameObj.num_tiles_x; i++) {
		for(var j = 0; j < gameObj.num_tiles_y; j++) {
			var landElement = new farming.Land(gameObj, playerObj).setPosition(i * gameObj.tile_size, j * gameObj.tile_size);
			landLayer.appendChild(landElement);
		}
	}

	// Replaces current scene (shows our game scene)
	director.replaceScene(startScene);

	// --------------SHOP ----------------
	// layer for shop
	var shopScene = new lime.Scene().setRenderer(lime.Renderer.CANVAS);
	var shopLayer = new lime.Layer().setAnchorPoint(0, 0);

	var shopBackground = new lime.Sprite().setAnchorPoint(0, 0).setPosition(0, 0).setSize(gameObj.width, gameObj.height).setFill('#0D0D0D');
	shopLayer.appendChild(shopBackground);
	shopScene.appendChild(shopLayer);

	//close button
	var closeButton = new lime.GlossyButton().setColor('#133242').setText('Back').setPosition(gameObj.width / 2, gameObj.height - 25).setSize(80, 40);
	shopLayer.appendChild(closeButton);

	// listens for mouse clicks, launches shop event
	goog.events.listen(shopButton, ['mousedown', 'touchstart'], function(e) {
		director.replaceScene(shopScene);
	});
	//close shop event
	goog.events.listen(closeButton, ['mousedown', 'touchstart'], function(e) {
		director.replaceScene(gameScene);
	});
	//shop items
	for(var i = 0; i < gameObj.crops.length; i++) {
		var item = new lime.Sprite().setAnchorPoint(0, 0).setPosition(gameObj.shop_margin_x, gameObj.shop_margin_y + (gameObj.shop_margin_y + gameObj.tile_size) * i).setFill('images/' + gameObj.crops[i].image).setSize(gameObj.tile_size, gameObj.tile_size);
		shopLayer.appendChild(item);

		var timeLabel = new lime.Label().setText(gameObj.crops[i].name + ' (' + gameObj.crops[i].time_to_ripe + ' days)').setFontColor('#E8FC08').setPosition(gameObj.shop_margin_x + 150, gameObj.shop_margin_y * 1.5 + (gameObj.shop_margin_y + gameObj.tile_size) * i);
		shopLayer.appendChild(timeLabel);
		var costLabel = new lime.Label().setText('cost: $' + gameObj.crops[i].cost).setFontColor('#E8FC08').setPosition(gameObj.shop_margin_x + 150, gameObj.shop_margin_y * 2.5 + (gameObj.shop_margin_y + gameObj.tile_size) * i);
		shopLayer.appendChild(costLabel);
		var label = new lime.Label().setText('revenue: $' + gameObj.crops[i].revenue).setFontColor('#E8FC08').setPosition(gameObj.shop_margin_x + 150, gameObj.shop_margin_y * 3.4 + (gameObj.shop_margin_y + gameObj.tile_size) * i);
		shopLayer.appendChild(label);

		//Select crop and store currently selected crop in the player Obj.
		(function(item, i) {
			goog.events.listen(item, ['mousedown', 'touchstart'], function(e) {
				playerObj.currentCrop = i;
				director.replaceScene(gameScene);
				// what crop are we holding?
				console.log("current crop: " + gameObj.crops[i].name);
			});
		})(item, i);

	}
}