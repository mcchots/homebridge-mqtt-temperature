var Service, Characteristic;
var mqtt    = require('mqtt');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mqtt-temperature", "mqtt-temperature", TemperatureAccessory);
}

function TemperatureAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.url = config['url'];
  this.topic = config['topic'];

  this.service = new Service.TemperatureSensor(this.name);
  this.client  = mqtt.connect(this.url);
  var that = this;
    this.client.subscribe(this.topic);
 
  this.client.on('message', function (topic, message) {
    // message is Buffer 
    data = JSON.parse(message);
    if (data === null) {return null}
    that.temperature = parseFloat(data);
//    that.log("that.MQTT Temperature: " , that.temperature);

});

  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getState.bind(this));
}

TemperatureAccessory.prototype.getState = function(callback) {
        this.log(this.name, " - MQTT : ", this.temperature);
    callback(null, this.temperature);
}

TemperatureAccessory.prototype.getServices = function() {
  return [this.service];
}

