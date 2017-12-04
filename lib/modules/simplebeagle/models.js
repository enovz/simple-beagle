//deps
var b = require("octalbonescript");
b.loadCape("cape-univ-hdmi");
var SerialPort = require("serialport");
var events = require("events");

//Input
function BeagleInput(key, value, cb) {
  //var self = this;
  (this.key = key), (this.default = value), (this.cb = cb);
  events.EventEmitter.call(this);

  b.attachInterrupt(
    key,
    b.CHANGE,
    hanldeInterrupt.bind(this),
    handleError.bind(this)
  );

  function handleError(err) {
    if (err) this.cb(err);
  }

  function hanldeInterrupt(err, pinData) {
    //var self = this;
    if (err) {
      return this.cb(err);
    }
    this.value = pinData.value;
    if (this.default != pinData.value) {
      this.stateChanged(pinData.value);
    }
  }
  
};
BeagleInput.prototype.stateChanged = stateChanged;
BeagleInput.prototype.__proto__ = events.EventEmitter.prototype;
function stateChanged(newState) {
  this.emit("stateChange", newState);
}
//Output;
function BeagleOutput(key, value) {
  //var self = this;
  (this.key = key), (this.value = value), (this.default = value);
  events.EventEmitter.call(this);

  b.pinModeSync(this.key, b.OUTPUT);
  if (this.default === 1) {
    b.digitalWriteSync(this.key, b.HIGH);
  } else {
    b.digitalWriteSync(this.key, b.LOW);
  }
  
  this.watchOutputPin();

};

BeagleOutput.prototype.watchOutputPin = watchOutputPin;
BeagleOutput.prototype.stateChanged = stateChanged;
BeagleOutput.prototype.changeState = changeState;
BeagleOutput.prototype.openRelay = openRelay;
BeagleOutput.prototype.__proto__ = events.EventEmitter.prototype;

function watchOutputPin() {
  
  setTimeout(watch.bind(this), 100);
  function watch(){
    if (this.value != this.default) {
        this.stateChanged(this.value);
      }
      this.watchOutputPin();
  }
}
function changeState() {
  //var self = this;
  
  if (this.value === 1) {
    b.digitalWriteSync(this.key, b.LOW);
    this.value = 0;
  } else {
    b.digitalWriteSync(this.key, b.HIGH);
    this.value = 1;
  }
}

function openRelay(delay) {
  //var self = this;

  if (this.default === 1) {
    b.digitalWriteSync(this.key, b.LOW);
    this.value = 0;
    setTimeout(function() {
      b.digitalWriteSync(this.key, b.HIGH);
      this.value = 1;
    }, delay * 1000);
  } else {
    b.digitalWriteSync(this.key, b.HIGH);
    this.value = 1;
    setTimeout(function() {
      b.digitalWriteSync(this.key, b.LOW);
      this.value = 1;
    }, delay * 1000);
  }
}

//SerailPort
function BeagleSerial(path, options, cb) {
  var port = this;
  //fishy
  b.serial.enable(path, function(err) {
    if (err) return console.error(err);
  });

  options.autoOpen = false;

  port = new SerialPort(path, options);
  
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
  
  return port;
};

//exports
module.exports = exports = {
  BeagleInput:BeagleInput,
  BeagleOutput:BeagleOutput,
  BeagleSerial:BeagleSerial
}