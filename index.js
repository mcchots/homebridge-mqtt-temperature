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
  this.client_Id 		= 'mqttjs_' + Math.random().toString(16).substr(2, 8);7
  this.options = {
    keepalive: 10,
    clientId: this.client_Id,
		protocolId: 'MQTT',
    protocolVersion: 4,
		clean: true,
		reconnectPeriod: 1000,
		connectTimeout: 30 * 1000,
    serialnumber: config["serial"] || this.client_Id,
    max_temperature: config["maxTemperature"] || 100,
    min_temperature: config["minTemperature"] || -50,
		username: config["username"],
		password: config["password"],
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
		rejectUnauthorized: false
	};

  this.service = new Service.TemperatureSensor(this.name);
  this.client  = mqtt.connect(this.url, this.options);

  var that = this;
    this.client.subscribe(this.topic);

  this.client.on('message', function (topic, message) {
    // message is Buffer
    try {
      data = JSON.parse(message);
    } catch (e) {
      return null;
    }

    if (data === null) {return null}
    log('data: ' + data);
    that.temperature = parseFloat(data);
    log('that.temperature: ' + that.temperature);
    if (!isNaN(that.temperature)) {
      that.service
        .setCharacteristic(Characteristic.CurrentTemperature, that.temperature);
    }
  });

  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getState.bind(this));

  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({minValue: this.options["min_temperature"]});

  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({maxValue: this.options["max_temperature"]});

}

TemperatureAccessory.prototype.getState = function(callback) {
        this.log(this.name, " - MQTT : ", this.temperature);
    callback(null, this.temperature);
}

TemperatureAccessory.prototype.getServices = function() {
  // you can OPTIONALLY create an information service if you wish to override
  // the default values for things like serial number, model, etc.

  var informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "MQTT Sensor")
    .setCharacteristic(Characteristic.Model, "MQTT Temperature")
    .setCharacteristic(Characteristic.SerialNumber, this.options["serialnumber"]);

  return [informationService, this.service];
}
