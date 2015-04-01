//@program
var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");

deviceURL = "";

var whiteSkin = new Skin( { fill:"white" } );
var labelStyle = new Style( { font: "bold 15px", color:"black" } );


Handler.bind("/discover", Behavior({
	onInvoke: function(handler, message){
		deviceURL = JSON.parse(message.requestText).url;
		//handler.invoke(new Message(discovery.url + "respond"), Message.TEXT);
	},
	onComplete: function(handler, message, text){
		trace("Response was: " + text + "\n");
	}
}));

Handler.bind("/forget", Behavior({
	onInvoke: function(handler, message){
		deviceURL = "";
	}
}));

var foodCounterLabel = new Label({left:75, top:-40, height:40, string:"null", style: labelStyle});
var waterCounterLabel = new Label({right:30, top:-40, height:40, string:"null", style: labelStyle});


var RefillFoodButton = BUTTONS.Button.template(function($){ return{
	left: 5, right: 250, top:0, height:30,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refill", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "foodRefill"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			foodCounterLabel.string = json.val;
		}}
	})
}});

var RefreshFoodButton = BUTTONS.Button.template(function($){ return{
	left: 75, right: 180, top: -30, height:30,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refresh", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "foodRefresh"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			foodCounterLabel.string = json.foodCount;
		}}
	})
}});

var RefillWaterButton = BUTTONS.Button.template(function($){ return{
	right: 70, left: 190, top: -30, height:30,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refill", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "waterRefill"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			waterCounterLabel.string = json.waterRefillVal;
		}}
	})
}});

var RefreshWaterButton = BUTTONS.Button.template(function($){ return{
	right: 5, left: 255, top: -30, height:30,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refresh", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "waterRefresh"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			waterCounterLabel.string = json.waterRefreshVal;
		}}
	})
}});

/*
var ResetWaterButton = BUTTONS.Button.template(function($){ return{
	left: 80, right: 80, height:60, bottom: 20,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refill", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "resetWater"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			//foodCounterLabel.string = json.count;
		}}
	})
}});
*/
var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, active: false, skin: whiteSkin,
	contents: [
		new Label({left:10, height:40, top:10, string:"Food:", style: labelStyle}),
	 	new Label({right:70, height:40, top: -40, string:"Water:", style: labelStyle}),
		foodCounterLabel,
		waterCounterLabel,
		new RefillFoodButton(),
		new RefreshFoodButton(),
		new RefillWaterButton(),
		new RefreshWaterButton(),
	],
	behavior: Behavior({
		onTouchEnded: function(content){
			if (deviceURL != "") content.invoke(new Message(deviceURL + "getCount"), Message.JSON);
		},
		onComplete: function(content, message, json){
			foodCounterLabel.string = json.count;
		}	
	})
});

var ApplicationBehavior = Behavior.template({
	onDisplayed: function(application) {
		application.discover("i2chover.example.kinoma.marvell.com");
	},
	onQuit: function(application) {
		application.forget("i2chover.example.kinoma.marvell.com");
	},
})

/*
Handler.bind("/getTime", {
    onInvoke: function(handler, message){
        handler.invoke(new Message(deviceURL + "/getCount"), Message.JSON);
    },
    onComplete: function(handler, message, json){
         //mainColumn.timeLabel.string = json.time;
         trace("******inside app");
         handler.invoke( new Message("/delay"));
    }
});

Handler.bind("/delay", {
    onInvoke: function(handler, message){
        handler.wait(10000); //will call onComplete after 10 seconds
    },
    onComplete: function(handler, message){
        handler.invoke(new Message("/getTime"));
    }
});
*/
application.behavior = new ApplicationBehavior();
application.add(mainColumn);
//application.invoke(new Message("/getTime"));