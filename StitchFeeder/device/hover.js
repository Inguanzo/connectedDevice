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
var foodAmount = 1;
exports.pins = {
    ts: {type: "Digital", direction: "input"},
    reset: {type: "Digital", direction: "output"},
    data: {type: "I2C", address: 0x42},
}

exports.configure = function(configuration) {
    this.tsPin = configuration.pins.ts.pin;

    this.ts.init();
    this.reset.init();
    this.data.init();

    this.reset.write(0);
    this.reset.direction = "input";

    sensorUtils.delay(1);

    this.data.readBlockDataSMB(0, 1, "Array");        // read to verify device present
}

exports.close = function() {
    this.ts.close();
    this.reset.close();
    this.data.close();
}

exports.read = function() {
    var result;

    if (this.ts.read())
        return;

    try {
        this.ts.direction = "output";
        this.ts.write(0);

        var busData = this.data.readBlockDataSMB(0, 18, "Array");

        var touchEvent = ((busData[14] & 0xE0) >>> 5) | ((busData[15] & 0x03) << 3);
        if (touchEvent > 0) {
            switch (touchEvent) {
                case  2: result = "WATER"; break;
                case 4: result = "CALL"; break
                case 8: result = "END CALL"; break
                case 16: result = "FOOD"; break;
                default: result = "mystery touch 0x" + busData[14].toString(16) + ", 0x" + busData[15].toString(16); break;
            }
        }
    }
    catch (e) {
        result = "error";
    }
    finally {
        this.ts.write(1);
        this.ts.direction = "input";
    }

    return result;
}
