//deps
var options = require("./options.json");
var core = require("../core");
var codeOk = false;

//exports
module.exports = exports = keyPad;

//methods
function keyPad(beagle) {
  var keyPad = beagle.serialPorts.keyPad;
  var door = beagle.outputs.door;

  door.on("stateChange", function(newValue) {
    requestSecurityCode(door.delay);
  });

  keyPad.on("data", function(data) {
    return handleKeyPadData(data);
  });
}

function handleKeyPadData(dataBuffer) {
  var code = dataBuffer.toString().replace(/\r\n/g, "");

  if (code !== "verySecretCode") {
    var log = core.models.Log("undefined", "wrong password");
    core.resolveLog(log);
    core.notifyServer("keypad/" + log.status, log);
  } else {
    var log = core.models.Log("undefined", "sucess");
    core.resolveLog(log);
    core.notifyServer("keypad/" + log.status, log);
    codeOk = true;
  }
}

function requestSecurityCode(delay) {
  setTimeout(function() {
    if (!codeOk) {
      var log = core.models.Log("undefined", "alarm");
      core.resolveLog(log);
      core.notifyServer("keypad/" + log.status, log);
    }
    codeOk = false;
  }, delay);
}
