//deps
var db = require("./db")();
var network = require("./network")();

//exports
module.exports = function core() {
  return {
    db: db,
    network: network,
    resolveLog: resolveLog,
    notifyServer: network.send,
    models: {
      Log: Log
    }
  };
};

//methods
function resolveLog(log) {
  db.logs.saveLog(log, function(err) {
    if (err) return handleError(err);
    return handleSaveSuccess();
  });
}

function handleError(err) {
  notwork.send("system/logs/fail", err);
  console.error(err);
  process.exit();
}

function handleSaveSuccess() {
  var sysLog = new SystemLog(log);
  notwork.send("system/logs/ok", sysLog);
}

//models
function SystemLog(log) {
  return {
    metadata: log.metadata,
    timestamp: new Date(),
    tags: ["beagle", "core", "saveLog", "db"]
  };
}

function Log(badgeId, status) {
  return {
    badgeId: badgeId,
    timestamp: new Date().toISOString(),
    status: status,
    metadata: beagle.metadata
  };
}
