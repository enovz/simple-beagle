//deps
var options = require("./options.json");
var simpleBeagle = require("../../modules/simplebeagle");

//exports
module.exports = exports = enterExitRfid;

//methods
function enterExitRfid() {
  simpleBeagle(options, function(err, beagle) {
    if (err) return console.error(err);
    return initApp(beagle);
  });
}

function initApp(beagle) {
  var enter = beagle.serialPorts.enter;
  var exit = beagle.serialPorts.exit;
  var door = beagle.outputs.door;

  enter.on("data", function(data) {
    var badgeId = data.toString().replace(/\r\n/g, "");

    if (badgeId === "myrfidcode") {
      console.log("welcome: " + badgeId);
      door.openReley(door.delay);
    } else {
      console.log("Not today ?");
    }
  });

  exit.on("data", function(data) {
    var badgeId = data.toString().replace(/\r\n/g, "");
    if (badgeId === "myrfidcode") {
      console.log("see ya: " + badgeId);
      door.openReley(door.delay);
    } else {
      console.log("How did u get here ?");
    }
  });
}
