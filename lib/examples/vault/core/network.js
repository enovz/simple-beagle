//deps
var mqtt = require("mqtt");
var brokerUrl = "mqtt://192.168.1.124:1883";
var subscriptions = [
  "server/online",
  "access/confirm",
  "access/confirm",
  "rex/confirm",
  "system/log/confirm"
];
var options = {
  qos: 1,
  retain: true
};

//exports
module.exports = exports = network;

//methods
function network() {
  client = mqtt.connect(brokerUrl);

  client.on("connect", function(err) {
    console.log("Mqtt Client connected.");
    subscriptions.forEach(function(sub) {
      client.subscribe(sub);
    });
    client.publish("beagle/online", "true", options, function(err) {
      if (err) console.log(err);
      //client.end();
    });
  });

  client.on("message", function(topic, message) {
    return hanldeMqttMessages(client, topic, message);
  });

  //return client;
  return (api = {
    send: send.bind(client)
  });
}

function hanldeMqttMessages(client, topic, message) {
  if (topic == "server/online") {
    console.log("Server is online: " + message);
  }
  if (topic == "access/confirm") {
    console.log("Access log reached server: " + message);
  }
  if (topic == "access/rex") {
    console.log("Rex log reached server: " + message);
  }
  if (topic == "system/log/confirm") {
    console.log("System log reached server: " + message);
  }
}

function send(topic, event) {
  console.log("Sending log to server ...");

  this.publish(topic, JSON.stringify(event), options, function(err) {
    if (err) console.log(err);
    //client.end();
  });
}
