//deps
var b = require("octalbonescript");
b.loadCape("cape-univ-hdmi");
var SerialPort = require("serialport");
var events = require("events");

//Input
module.exports = exports = function Input(key, value, cb) {
  var self = this;
  (self.key = key), (self.default = value);
  events.EventEmitter.call(self);

  b.attachInterrupt(
    self.key,
    b.CHANGE,
    hanldeInterrupt.bind(self),
    handleError
  );

  function handleError(err) {
    if (err) return cb(err);
  }

  function hanldeInterrupt(err, pinData) {
    var self = this;
    if (err) {
      return console.error(err);
    }
    self.value = pinData.value;
    if (self.default != pinData.value) {
      self.stateChanged(pinData.value);
    }
  }
};
Input.prototype.stateChanged = stateChanged;
Input.prototype.__proto__ = events.EventEmitter.prototype;
function stateChanged(newState) {
  this.emit("stateChange", newState);
}
//Output
module.exports = exports = function Output(key, value) {
  var self = this;
  (self.key = key), (self.value = value), (self.default = value);
  events.EventEmitter.call(self);

  b.pinModeSync(self.key, b.OUTPUT);
  if (self.default === 1) {
    b.digitalWriteSync(self.key, b.HIGH);
  } else {
    b.digitalWriteSync(self.key, b.LOW);
  }

  watchInputPin();

  function watchInputPins() {
    setTimeout(function() {
      if (self.value != self.default) {
        self.stateChanged(self.value);
      }
      watchInputPins();
    }, 100);
  }
};

Output.prototype.stateChanged = stateChanged;
Output.prototype.changeState = changeState;
Output.prototype.openRelay = openRelay;
Output.prototype.__proto__ = events.EventEmitter.prototype;

function changeState() {
  var self = this;

  if (self.default === 1) {
    b.digitalWriteSync(self.key, b.LOW);
    self.value = 0;
  } else {
    b.digitalWriteSync(self.key, b.HIGH);
    self.value = 1;
  }
}

function openRelay(delay) {
  var self = this;

  if (self.default === 1) {
    b.digitalWriteSync(self.key, b.LOW);
    self.value = 0;
    setTimeout(function() {
      b.digitalWriteSync(self.key, b.HIGH);
      self.value = 1;
    }, delay * 1000);
  } else {
    b.digitalWriteSync(self.key, b.HIGH);
    self.value = 1;
    setTimeout(function() {
      b.digitalWriteSync(self.key, b.LOW);
      self.value = 1;
    }, delay * 1000);
  }
}

//SerailPort
module.exports = exports = function Serial(path, options, cb) {
  var self = this;
  //fishy
  b.serial.enable(path, function(err) {
    if (err) return console.error(err);
  });

  options.autoOpen = false;
  self = new SerialPort(path, options);

  port.open(function(err) {
    if (err) return cb(err);
  });
  port.on("open", function(data) {
    console.info("Port " + path + " is open");
  });
  port.on("disconnect", function() {
    console.info("Port " + path + "disconnected");
  });
  port.on("close", function() {
    console.info("Port " + path + "closed");
  });
};
