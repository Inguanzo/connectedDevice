//@program
var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");

deviceURL = "";

var whiteSkin = new Skin( { fill:"white" } );
var labelStyle = new Style( { font: "bold 40px", color:"black" } );


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

//var counterLabel = new Label({left:0, right:0, height:40, string:"refill", style: labelStyle});
var ResetButton = BUTTONS.Button.template(function($){ return{
	left: 80, right: 80, height:60,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refill", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "reset"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			//counterLabel.string = "full";//json.count;
		}}
	})
}});

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
			//counterLabel.string = "full";//json.count;
		}}
	})
}});

var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, active: false, skin: whiteSkin,
	contents: [
		new Label({left:0, right:0, height:40, string:"Food:", style: labelStyle}),
		//counterLabel,
		new ResetButton(),
		new Label({left:0, right:0, height:40, bottom: 20, string:"Water:", style: labelStyle}),
		//counterLabel,
		new ResetWaterButton()
	],
	behavior: Behavior({
		onTouchEnded: function(content){
			if (deviceURL != "") content.invoke(new Message(deviceURL + "getCount"), Message.JSON);
		},
		onComplete: function(content, message, json){
			//counterLabel.string = json.count;
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

application.behavior = new ApplicationBehavior();
application.add(mainColumn);