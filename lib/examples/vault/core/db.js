//deps
var tungus = require("tungus");
var mongoose = require("mongoose");
var dbUrl = "tingodb://" + __dirname + "/database";

//exports
module.exports = exports = db;

//methods
function db() {
  mongoose.connect(dbUrl, function(err) {
    if (err) throw err;
    else {
      console.log("Database connection established");
    }
  });

  var schemas = {
    LogSchema: new mongoose.Schema({
      badgeId: badgeId,
      timestamp: new Date().toISOString(),
      status: status,
      metadata: beagle.metadata
    }),
    idBadgeSchema: new mongoose.Schema({
      data: String,
      timeProfile: {
        name: String,
        schedule: [
          {
            day: String,
            from: String,
            to: String
          }
        ]
      }
    })
  };

  mongoose.model("logs", schemas.LogSchema);
  mongoose.model("idBadges", schemas.idBadgeSchema);

  var models = {
    Log: mongoose.model("logs"),
    IdBadge: mongoose.model("idBadges")
  };

  var api = {
    logs: {
      saveLog: saveLog.bind(models)
    },
    models: models
  };

  return api;
}

function saveLog(log, callback) {
  var _log = new this.Log(log);
  _log.save(function(err) {
    if (err) callback(err, null);
    else callback(null, "Log saved");
  });
}
