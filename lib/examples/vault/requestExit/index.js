//deps
var options = require("./options.json");
var core = require("../core");

//exports
module.exports = exports = requestExit;

//methods
function requestExit(beagle) {
  var requestExit = beagle.inputs.requestExit;
  requestExit.on("stateChange", handleRexData);
}

function handleRexData(newState) {
  var log = core.models.Log("undefined", "rex");
  core.resolveLog(log);
  core.notifyServer("acess/" + log.status, log);
  beagle.door.openRelay(beagle.door.delay);
}
