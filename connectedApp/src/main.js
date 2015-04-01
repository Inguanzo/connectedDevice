//@program
var THEME = require("themes/flat/theme");
var BUTTONS = require("controls/buttons");

deviceURL = "";

var blueSkin = new Skin( { fill:"#000066" } );
var pinkSkin = new Skin( { fill:"#CC6666" } );
var coffeeSkin = new Skin( { fill:"#33CCCC" } );
var yellowSkin = new Skin( { fill:"#FFFF33" } );
var redSkin = new Skin( { fill:"#CC0033" } );
var whiteSkin = new Skin( { fill:"white" } );
var greenSkin = new Skin( { fill:"green" } );


var labelStyle = new Style( { font: "bold 20px", color:"black" } );
var smallLabelStyle = new Style( { font: "bold 15px", color:"black" } );
var foodLabelStyle = new Style( { font: "bold 20px", color:"white" } );
var foodSmallLabelStyle = new Style( { font: "bold 15px", color:"white" } );


var callStyle = new Style( { font: "bold 25px", color:"white" } );
var smallCallStyle = new Style( { font: "bold 15px", color:"white" } );


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

var foodCounterLabel = new Label({left:80, top:-50, height:40, string:"", style: foodSmallLabelStyle});
var waterCounterLabel = new Label({right:30, top:-60, height:40, string:"", style: foodSmallLabelStyle});


var RefillFoodButton = BUTTONS.Button.template(function($){ return{
	left: 5, right: 250, top:0, height:30, skin: whiteSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refill", style: smallLabelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "foodRefill"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			foodCounterLabel.string = json.val;
			iceCream.url = "./full.png";
		}}
	})
}});

var RefreshFoodButton = BUTTONS.Button.template(function($){ return{
	left: 75, right: 180, top: -30, height:30, skin: whiteSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refresh", style: smallLabelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "foodRefresh"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			foodCounterLabel.string = json.foodCount;
			if(json.foodCount < 8 && json.foodCount > 3) {
				iceCream.url = "./twoThirds.png";	
			}
			if(json.foodCount < 4 && json.foodCount > 0) {
				iceCream.url = "./oneThird.png";	
			}		
			if(json.foodCount < 1 || json.foodCount == "empty"){
				iceCream.url = "./empty.png"
			}
			}}
	})
}});

var RefillWaterButton = BUTTONS.Button.template(function($){ return{
	right: 70, left: 190, top: -30, height:30, skin: yellowSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refill", style: smallLabelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "waterRefill"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			waterCounterLabel.string = json.waterRefillVal;
			coffee.url = "./fullCup.png";
		}}
	})
}});

var RefreshWaterButton = BUTTONS.Button.template(function($){ return{
	right: 5, left: 255, top: -30, height:30,skin: yellowSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refresh", style: smallLabelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "waterRefresh"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			waterCounterLabel.string = json.waterRefreshVal;
			if(json.waterRefreshVal < 8 && json.waterRefreshVal > 3) {
				coffee.url = "./twoThirdsCup.png";	
			}
			if(json.waterRefreshVal < 4 && json.waterRefreshVal > 0) {
				coffee.url = "./oneThirdCup.png";	
			}		
			if(json.waterRefreshVal < 1 || json.waterRefreshVal == "empty"){
				coffee.url = "./emptyCup.png"
			}
			
		}}
	})
}});

//var timeVar = new Label({left: 0, right: 0, height: 70, string: "Loading...", style: labelStyle});
var callVar = new Label({left: 5, height: 70, top: 50, string: "incoming calls:", style: callStyle});
var callResponseLabel = new Label({left: 5, height: 70, top: -40, string: "no current calls", style: smallCallStyle});

var AnswerCallButton = BUTTONS.Button.template(function($){ return{
	right: 5, left: 200, top:-50, height:30, skin: redSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"Answer", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "answerCall"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			callResponseLabel.string = json.answerResponse;
			if(callResponseLabel.string == "now speaking"){
				stitch.url = "./stitch.png";
			}
		}}
	})
}});
var RefreshCallButton = BUTTONS.Button.template(function($){ return{
	right: 5, left: 200, top:10, height:30, skin: redSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"Refresh", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "refreshCall"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			callResponseLabel.string = json.value;
			if(callResponseLabel.string == "now speaking" || callResponseLabel.string == "Stitch is calling"){
				stitch.url = "./stitch.png";
			}
		}}
	})
}});
var EndCallButton = BUTTONS.Button.template(function($){ return{
	right: 5, left: 200, top:10, height:30, skin: redSkin,
	contents: [
		new Label({left:0, right:0, height:60, string:"End Call", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "endCall"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			callResponseLabel.string = json.endVal;
			stitch.url = "";
		}}
	})
}});

var MakeCallButton = BUTTONS.Button.template(function($){ return{
	right: 160, left: 5, top:-30, height:30, skin: greenSkin,
	contents: [
		new Label({left:10, right:0, height:60, string:"Call Stitch", style: labelStyle})
	],
	behavior: Object.create(BUTTONS.ButtonBehavior.prototype, {
		onTap: { value: function(content){
			content.invoke(new Message(deviceURL + "callStitch"), Message.JSON);
		}},
		onComplete: { value: function(content, message, json){
			callResponseLabel.string = json.stitchResponse;
			stitch.url = "./stitch.png";
		}}
	})
}});

var titleImage = new Picture({left:-50, top:-100, url: "./titleImage.png"}),
var iceCream = new Picture({left:-110, height:40, top:-240, height: 100,  url: "./full.png"}),
var coffee = new Picture({right:-70, top: -70, height:100, url: "./fullCup.png"}),

var stitch = new Picture({left:-10, top:-110, height:70, active: false, url: ""}),


var mainColumn = new Column({
	left: 0, right: 0, top: 0, bottom: 0, active: false, skin: blueSkin,
	contents: [
		titleImage,
		//new Label({left:10, height:40, top:-220, string:"Ice Cream:", style: foodLabelStyle}),
		iceCream,
	 	//new Label({right:70, height:40, top: -40, string:"Coffee:", style: foodLabelStyle}),
		foodCounterLabel,			 	
		coffee,		
		waterCounterLabel,
		new RefillFoodButton(),
		new RefreshFoodButton(),
		new RefillWaterButton(),
		new RefreshWaterButton(),
		callVar,
		new AnswerCallButton(),
		new RefreshCallButton(),
		callResponseLabel,
		new EndCallButton(),
		new MakeCallButton(),
		stitch,
		//timeVar,
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


/*Handler.bind("/getTime", {
    onInvoke: function(handler, message){
        handler.invoke(new Message(deviceURL + "getCount"), Message.JSON);
    },
    onComplete: function(handler, message, json){
         foodCounterLabel.string = json.foodVariable;
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
});*/


application.behavior = new ApplicationBehavior();
application.add(mainColumn);
application.invoke(new Message("/getTime"));
