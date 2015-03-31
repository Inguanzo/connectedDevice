//@program
/*
  Copyright 2011-2014 Marvell Semiconductor, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var foodAmount = 10;
var waterAmount = 10;

var fullTexture = new Texture("./full.png");
var fullSkin = new Skin({ texture: fullTexture, x:0, y:0, width:200, height:200, variants:200, states:200 } );

var fullWaterTexture = new Texture("./full2.png");
var fullWaterSkin = new Skin({ texture: fullWaterTexture, x:0, y:0, width:200, height:200, variants:200, states:200 } );

var emptyTexture = new Texture("./empty.png");
var emptySkin = new Skin({ texture: emptyTexture, x:0, y:0, width:200, height:200, variants:200, states:200 } );

var emptyWaterTexture = new Texture("./empty2.png");
var emptyWaterSkin = new Skin({ texture: emptyWaterTexture, x:0, y:0, width:200, height:200, variants:200, states:200 } );

var errorStyle = new Style({ font:"bold 40px", color:"white", horizontal:"center", vertical:"middle" });

var fadeBehavior = Object.create(Behavior.prototype, {
	onCreate: { value: function(content, data) {
		content.duration = 1500;
	}},
	onTimeChanged: { value: function(content) {
		content.state = 1 - Math.cubicEaseOut(content.fraction);
	}},
});

var whiteSkin = new Skin( { fill:"white" } );
var labelStyle = new Style( { font: "bold 40px", color:"black" } );

var counterLabel = new Label({right:60, height:10, bottom: 50, string:foodAmount, style: labelStyle, name: "foodAmountLabel"});
var waterCounterLabel = new Label({left:60, height:10, bottom: 50, string:foodAmount, style: labelStyle, name: "waterAmountLabel"});

var foodImage = new Picture({right:5, top:30, height: 170,  url: "./full.png"}),
var waterImage = new Picture({left:5, top:30, height: 170,  url: "./full2.png"}),


var Screen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0, skin: new Skin({ fill: "blue" }),
	contents: [
		Content($, { name: "WATER", anchor:"WATER", behavior:fadeBehavior,left:10, top: 50, variant: 0 }),
		Content($, { name: "FOOD", anchor:"FOOD", behavior:fadeBehavior,left:10, top: 50, variant: 0 }),
		foodImage,
		waterImage,
		new Label({right: 23, top:2, height:80, string:"Food:", style: labelStyle}), 
		new Label({left: 15, top:2, height:80, string:"Water:", style: labelStyle}), 
		counterLabel,
		waterCounterLabel,
	]
}});

var ErrorScreen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0, skin: new Skin({ fill: "#f78e0f" }),
	contents: [
		Label($, { left:0, right:0, top:0, bottom:0, style: errorStyle, string:"Error " + $.error })
	]
}});


function amountItem(item) {
	if(item == "FOOD"){
		if(foodAmount - 1 > -1){
			foodAmount -= 1;
		}
		trace(foodAmount);
		counterLabel.string = foodAmount;
	}
	if(item == "WATER"){
		if(waterAmount - 1 > -1){
			waterAmount -= 1;
		}
		trace(waterAmount);
		waterCounterLabel.string = waterAmount;
		
	}
}

Handler.bind("/respond", Behavior({
	onInvoke: function(handler, message){
		message.responseText = "You found me!";
		message.status = 200;	
	}
}));

Handler.bind("/hoverData", {
	onInvoke: function(handler, message) {
	
		var data = model.data;
		var it = message.requestObject;
		var content = data[it];
		
		amountItem(content.name);
		if(content.name == "FOOD" && foodAmount < 1) {
			foodImage.url = "./empty.png";	
			counterLabel.string = "empty";			
		}
		if(content.name == "WATER" && waterAmount < 1) {
			waterImage.url = "./empty2.png";
			waterCounterLabel.string = "empty";			
		}
		
		content.state = 1;
		content.time = 0;
		content.start();
	
	}
});

Handler.bind("/getCount", Behavior({
	onInvoke: function(handler, message){
		if(foodAmount < 10) {
			foodAmount = 10;
		}
		message.responseText = JSON.stringify( { count: count } );
		message.status = 200;
		foodAmount = count + foodAmount;
		counterLabel.string = foodAmount;
		
		trace("amount: " + foodAmount + "\n");
		trace("count******" + count + "\n");
		
	}
}));

Handler.bind("/reset", Behavior({
	onInvoke: function(handler, message){
		foodAmount = 10;
		foodImage.url = "./full.png";	
		count = 0;
		counterLabel.string = "10";
		message.responseText = JSON.stringify( { count: "10" } );
		message.status = 200;
	}
}));

Handler.bind("/resetWater", Behavior({
	onInvoke: function(handler, message){
		waterAmount = 10;
		waterImage.url = "./full2.png";	
		//count = 0;
		waterCounterLabel.string = "10";
		message.responseText = JSON.stringify( { count: "10" } );
		message.status = 200;
	}
}));


var model = application.behavior = Object.create(Object.prototype, {
	onComplete: { value: function(application, message, text) {
		if (0 != message.error)
			application.replace(application.first, new ErrorScreen(message));
        else
            application.invoke(new MessageWithObject("pins:/hover/read?repeat=on&callback=/hoverData&interval=16"));
	}},
	onLaunch: { value: function(application) {
        application.shared = true;
        var message = new MessageWithObject("pins:configure", {
            hover: {
                require: "hover",
                pins: {
                    ts: {pin: 23},
                    reset: {pin: 24},
                    data: {sda: 27, clock: 29}
                }
            }});
        application.invoke(message, Message.TEXT);

		this.data = { };
 		application.add(new Screen(this.data));
	}},
	onQuit: function(application) {
		application.shared = false;
	},
});

count = 0;

