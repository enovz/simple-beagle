//deps
var rfidScanner = require("./rfidScanner");
var requestExit = require("./requestExit");
var keyPad = require("./keyPad");
var simpleBeagle = require("../../modules/simplebeagle");
var options = require("./options.json");

//exports
module.exports = exports = vault;

//methods
function vault() {
  return simpleBeagle(options, function(err, beagle) {
    if (err) handleError(err);
    return initApps(beagle);
  });
}

function initApps(beagle) {
  rfidScanner(beagle);
  keyPad(beagle);
  requestExit(beagle);
}

function handleError(err) {
  console.error(err, err.stack);
  return process.exit();
}
