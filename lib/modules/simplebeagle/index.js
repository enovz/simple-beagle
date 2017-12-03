//dependencies
var _async = require("async");
var ip = require("ip");
var uuidv4 = require("uuid/v4");
var Input = require("./models").Input;
var Output = require("./models").Output;
var Serial = require("./models").Serial;

//exports
module.exports = exports = simpleBeagle;

//methods
function simpleBeagle(options, cb) {
  var config = {};
  config.name = typeof options.name != "undefined" ? options.name : "";
  config.v = typeof options.v != "undefined" ? options.v : "";
  config.inputPins =
    typeof options.inputPins != "undefined" ? options.inputPins : [];
  config.outputPins =
    typeof options.outputPins != "undefined" ? options.outputPins : [];
  config.serialPorts =
    typeof options.serialPorts != "undefined" ? options.serialPorts : [];

  var beagle = {
    metadata: {
      name: config.name,
      v: config.v,
      uiid: uuidv4(),
      address: ip.address()
    },
    inputs: {},
    outputs: {},
    serialPorts: {}
  };

  return _async.waterfall(
    [
      function(callback) {
        return initInputPins(config.inputPins, function(err, result) {
          if (err) return callback(err);
          else {
            console.info("inputPins configured");
            beagle.inputs = result;
            return callback(null);
          }
        });
      },
      function(callback) {
        return initOutputPins(config.outputPins, function(err, result) {
          if (err) return callback(err);
          console.info("outputPins configured");
          beagle.outputs = result;
          return callback(null);
        });
      },
      function(callback) {
        return initSerialPorts(config.serialPorts, function(err, result) {
          if (err) return callback(err);
          console.info("serialPorts configured");
          beagle.serialPorts = result;
          return callback(null);
        });
      }
    ],
    function(err) {
      if (err) return cb(err);
      console.info("Beagle configured");
      return cb(null, beagle);
    }
  );
}

function initInputPins(inputPins, cb) {
  var config = inputPins.reduce(function(all, item, index) {
    all[item.alias] = new Input(item.key, item.value, cb);
    return all;
  }, {});

  cb(null, config);
}

function initOutputPins(outputPins, cb) {
  var config = outputPins.reduce(function(all, item, index) {
    all[item.alias] = new Output(item.key, item.value, item.startValue);
    return all;
  }, {});

  cb(null, config);
}

function initSerialPorts(serialPorts, cb) {
  var config = serialPorts.reduce(function(all, item, index) {
    all[item.alias] = new Serial(item.path, item.options, cb);
    return all;
  }, {});

  return cb(null, config);
}
