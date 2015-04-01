//@module
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
var THEME = require ("themes/flat/theme");
var CONTROL = require ("mobile/control");
var PinsSimulators = require ("PinsSimulators");
var buttonStyle = new Style({ font:"bold 20px", color:["balck","black","black"], horizontal:"center" });
var OrientationBehavior = function(column, data) {
	Behavior.call(this, column, data);
}
OrientationBehavior.prototype = Object.create(Behavior.prototype, {
	onCreate: { value: function(column, data) {
        column.partContentsContainer.add(new OrientationLine(data)); 
	}},
});
var OrientationButton = Container.template(function($) { return {
	width:80, height:30, active:true, skin:THEME.buttonSkin,
	behavior: Object.create(CONTROL.ButtonBehavior.prototype, {
		onCreate: { value: function(container, $) {
			CONTROL.ButtonBehavior.prototype.onCreate.call(this, container, $.data);
			this.value = $.value;
		}},
		onTap: { value: function(container) {
			this.data.value = this.value;
		}},
	}),
	contents: [
		Label($, { top:0, bottom:0, style:buttonStyle, string:$.string }),
	]
}});



var blueSkin = new Skin( { fill:"#000066" } );
var pinkSkin = new Skin( { fill:"#CC6666" } );
var coffeeSkin = new Skin( { fill:"#33CCCC" } );
var yellowSkin = new Skin( { fill:"#FFFF33" } );
var redSkin = new Skin( { fill:"#CC0033" } );
var whiteSkin = new Skin( { fill:"white" } );

var labelStyle = new Style( { font: "bold 40px", color:"black" } );


var OrientationLine = Container.template(function($) { return {
	left:0, right:0, height:260, skin: blueSkin,
	contents: [
		new Picture({top:-40, left:60,right:10, height: 200,  url: "./titleImage.png"}),
		
		Container(null, {
			left:0, right:0, top:30, height:110,
			contents: [
				OrientationButton({ data:$, string:"Ice Cream", value: "FOOD"}, { left: 30, right: 200, skin: whiteSkin }),
				OrientationButton({ data:$, string:"Coffee", value: "WATER" }, { left:200, right:30, skin: yellowSkin }),
				OrientationButton({ data:$, string:"Call", value: "CALL"}, { bottom: -10, skin: redSkin }),
				OrientationButton({ data:$, string:"End Call", value: "END CALL"}, { bottom: -50, skin:redSkin }),
				
			],
		}),		
	],
}});

exports.pins = {
    ts: {type: "Digital", direction: "input"},
    reset: {type: "Digital", direction: "output"},
    data: {type: "I2C", address: 0x42},
}
exports.configure = function(configuration) {
	this.data = {
		id: 'HOVER',
		behavior: OrientationBehavior,
		header : { 
			label : this.id, 
			name : "HOVER", 
			iconVariant : PinsSimulators.SENSOR_KNOB 
		},
		value: undefined
	};
	this.container = shell.delegate("addSimulatorPart", this.data);
}
exports.close = function() {
	shell.delegate("removeSimulatorPart", this.container);
}
exports.read = function() {
	var value = this.data.value;
	this.data.value = undefined;
	return value;
}
