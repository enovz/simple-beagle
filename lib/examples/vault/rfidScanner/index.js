//deps
var options = require("./options.json");
var core = require("../core");

//exports
module.exports = exports = rfidScanner;

//methods
function rfidScanner(beagle) {
  var rfidScanner = beagle.serialPorts.rfidScanner;
  rfidScanner.on("data", handleRfidData);
}

function handleRfidData(dataBuffer) {
  var badgeId = dataBuffer.toString().replace(/\r\n/g, "");
  return genrateLog(badgeId, handleLog);
}

function genrateLog(badgeId, cb) {
  console.log("Generating log ...");

  core.db.models.IdBadge.find({ id: badgeId }, function(err, result) {
    if (err) cb(err);
    if (result.length > 1) {
      return cb(new Error("Found multiple matches in validation"));
    }
    if (result.length == 1 && validSchedule(result[0].schedule)) {
      var log = core.models.Log(badgeId, "granted");
      cb(null, log);
    } else {
      var log = core.models.Log(badgeId, "denied");
      cb(null, log);
    }
  });

  function validSchedule(schedule) {
    var now = currentDayTime();

    var day = schedule.filter(function(item) {
      return (
        item.day == now.day && itme.day.startTime < now.time < item.day.endTime
      );
    });
    if (day.length == 1) return true;
    else {
      return false;
    }
  }
}

function handleLog(err, log) {
  if (err) {
    return handleError(err);
  }
  core.resolveLog(log);
  core.notifyServer("acess/" + log.status, log);
  if (log.status === "granted") {
    beagle.door.openRelay(beagle.door.delay);
  }
}

function currentDayTime() {
  var array = new Date().toString().split(" ");
  var day = array[0];

  var time_arr = array[4].split(":");
  var time = parseInt(time_arr[0]) * 60 + parseInt(time_arr[1]);
  return { day: day, time: time };
}

function handleError(err) {
  console.error(err);
  process.exit();
}
