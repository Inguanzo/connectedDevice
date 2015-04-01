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
var callBoolean = 0;

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

var whiteSkin = new Skin( { fill:"#000066" } );
var labelStyle = new Style( { font: "bold 20px", color:"white" } );

var counterLabel = new Label({left:60, height:10, bottom: 50, string:foodAmount, style: labelStyle, name: "foodAmountLabel"});
var waterCounterLabel = new Label({right:60, height:10, bottom: 50, string:foodAmount, style: labelStyle, name: "waterAmountLabel"});

var foodImage = new Picture({left:-70, top:35, height: 130,  url: "./full.png"}),
var waterImage = new Picture({right:-110, top:45, height: 140,  url: "./fullCup.png"}),

var callingLabel = new Label({right:0, left:0, height:10, bottom: 10, string: "", style: labelStyle});


var Screen = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0, skin: new Skin({ fill: "#000066" }),
	contents: [
		Content($, { name: "FOOD", anchor:"FOOD", behavior:fadeBehavior,left:10, top: 50, variant: 0 }),
		Content($, { name: "WATER", anchor:"WATER", behavior:fadeBehavior,left:10, top: 50, variant: 0 }),
		Content($, { name: "CALL", anchor:"CALL", behavior:fadeBehavior,left:10, top: 50, variant: 0 }),
		Content($, { name: "END CALL", anchor:"END CALL", behavior:fadeBehavior,left:10, top: 50, variant: 0 }),
		
		new Picture({top:-20, left:80, height: 150,  url: "./titleImage.png"}),
		
		foodImage,
		waterImage,
		new Label({left: 23, top:2, height:80, string:"Ice Cream:", style: labelStyle}), 
		new Label({right: 15, top:2, height:80, string:"Coffee:", style: labelStyle}), 
		counterLabel,
		waterCounterLabel,
		callingLabel
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
			if(foodAmount < 8 && foodAmount > 3) {
				foodImage.url = "./twoThirds.png";	
			}
			if(foodAmount < 4) {
				foodImage.url = "./oneThird.png";	
			}
		}
		trace(foodAmount);
		counterLabel.string = foodAmount;
	}
	if(item == "WATER"){
		if(waterAmount - 1 > -1){
			waterAmount -= 1;
		if(waterAmount < 8 && waterAmount > 3) {
				waterImage.url = "./twoThirdsCup.png";	
			}
			if(waterAmount < 4) {
				waterImage.url = "./oneThirdCup.png";	
			}
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

var ended = 0;

Handler.bind("/hoverData", {
	onInvoke: function(handler, message) {
	
		var data = model.data;
		var it = message.requestObject;
		var content = data[it];
		ended = 0;
		
		amountItem(content.name);
		if(content.name == "FOOD" && foodAmount < 1) {
			foodImage.url = "./empty.png";	
			counterLabel.string = "empty";			
		}
		if(content.name == "WATER" && waterAmount < 1) {
			waterImage.url = "./emptyCup.png";
			waterCounterLabel.string = "empty";			
		}
		
		if(content.name == "CALL") {
			if(callBoolean == 0){
				callingLabel.string = "calling...";
				callBoolean = 1;
			}		
		}
		
		if(content.name == "END CALL") {
			if(callBoolean == 1){
				callingLabel.string = "call ended";
				callBoolean = 0;
			} else {
				callingLabel.string = "";				
			} 
			ended = 1;
		}
		
		content.state = 1;
		content.time = 0;
		content.start();
	
	}
});

Handler.bind("/getCount", Behavior({
	onInvoke: function(handler, message){
		trace("++++++++++inside device");
		count = "5";
		counterLabel.string = foodAmount;
		message.responseText = JSON.stringify( { count: count } );
		message.status = 200;
	}
}));

Handler.bind("/foodRefill", Behavior({
	onInvoke: function(handler, message){
		foodImage.url = "./full.png";	
		foodAmount = 10;
		counterLabel.string = foodAmount;
		message.responseText = JSON.stringify( { val: foodAmount } );
		message.status = 200;
	}
}));

Handler.bind("/foodRefresh", Behavior({
	onInvoke: function(handler, message){
		if(foodAmount == 0){
			foodVar = "empty"
		} else {
			foodVar = foodAmount
		}
		message.responseText = JSON.stringify( { foodCount: foodVar } );
		message.status = 200;
	}
}));

Handler.bind("/waterRefill", Behavior({
	onInvoke: function(handler, message){
		waterImage.url = "./fullCup.png";	
		waterAmount = 10;
		waterCounterLabel.string = waterAmount;
		message.responseText = JSON.stringify( { waterRefillVal: waterAmount } );
		message.status = 200;
	}
}));

Handler.bind("/waterRefresh", Behavior({
	onInvoke: function(handler, message){
		if(waterAmount == 0){
			waterVar = "empty"
		} else {
			waterVar = waterAmount
		}
	
		message.responseText = JSON.stringify( { waterRefreshVal: waterVar } );
		message.status = 200;
	}
}));

Handler.bind("/check", Behavior({
	onInvoke: function(handler, message){
		message.responseText = JSON.stringify( { respondCheck: "empty" } );
		message.status = 200;
	}
}));

var callVar = "";

Handler.bind("/answerCall", Behavior({
	onInvoke: function(handler, message){
		if(callBoolean == 0){
			callVar = "no current calls";
		} else {
			callingLabel.string = "now speaking";
			callVar = "now speaking";
		}
		message.responseText = JSON.stringify( { answerResponse: callVar } );
		message.status = 200;
	}
}));


Handler.bind("/refreshCall", Behavior({
	onInvoke: function(handler, message){
		if(callVar == "now speaking"){
			myVal = "now speaking";
		} 
		else if(callBoolean == 1){
			myVal = "Stitch is calling";
		}
		else {
			myVal = "no current calls";
		}
		message.responseText = JSON.stringify( { value: myVal } );
		message.status = 200;
	}
}));

Handler.bind("/endCall", Behavior({
	onInvoke: function(handler, message){
		callVar = "";
		if(callBoolean == 1) {
			newValue = "call ended";
		} else {
			newValue = "no current calls";
		}
		callBoolean = 0;
		callingLabel.string = "";
		message.responseText = JSON.stringify( { endVal: newValue } );
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

