//deps
var options = require("./options.json");
var simpleBeagle = require("../../modules/simplebeagle");

//exports
module.exports = exports = lightSwitch;

//methods
function lightSwitch() {
  simpleBeagle(options, function(err, beagle) {
    if (err) return console.error(err);
    return initApp(beagle);
  });
}

function initApp(beagle) {
  var button = beagle.inputs.button;
  var light = beagle.outputs.light;

  button.on("stateChange", function(data) {
    console.log(data);
    return light.changeState();
  });
}

return lightSwitch();