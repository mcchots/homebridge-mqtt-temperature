var Service, Characteristic;
var mqtt    = require('mqtt');
var debug = require('debug')('mqtt-temperature');

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
  this.batt_topic = config['batt_topic'];
  this.batt_low_perc = config['batt_low_perc'] || 20;
  this.client_Id 		= 'mqttjs_' + Math.random().toString(16).substr(2, 8);
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

  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({minValue: parseFloat(this.options["min_temperature"]),
               maxValue: parseFloat(this.options["max_temperature"])})
    .on('get', this.getState.bind(this));

  this.client  = mqtt.connect(this.url, this.options);

  if (this.batt_topic) {
      this.service.addCharacteristic(Characteristic.BatteryLevel)
      .on('get', this.getBattery.bind(this));
  
    this.service.addCharacteristic(Characteristic.StatusLowBattery)
      .on('get', this.getLowBattery.bind(this));

    this.client.subscribe(this.batt_topic);
  }

  this.client.subscribe(this.topic);
  var that = this;

  //that.lowBattery = true;

  this.client.on('message', function (topic, message) {

    try {
      data = JSON.parse(message);
    } catch (e) {
      return null;
    }
    if (data === null) {return null}

    data = parseFloat(data);
    if ( !isNaN(data) ) {

      if (topic === that.topic) { 
        that.temperature = data;
        debug('Sending MQTT.Temperature: ' + that.temperature);
        that.service
          .getCharacteristic(Characteristic.CurrentTemperature).updateValue(that.temperature);
      }
      if (that.batt_topic) {
        if (topic === that.batt_topic) { 
          that.battery = data;
          debug('Sending MQTT.Battery: ' + that.battery);
          that.service
            .getCharacteristic(Characteristic.BatteryLevel).updateValue(that.battery);
          
          (data <= that.batt_low_perc) ? that.lowBattery = true : that.lowBattery = false;

          that.service
            .getCharacteristic(Characteristic.StatusLowBattery).updateValue(that.lowBattery);
          
        }
      }
    }
  });

}

TemperatureAccessory.prototype.getState = function(callback) {
  debug("Get Temperature Called: " + this.temperature);
  callback(null, this.temperature);
}

TemperatureAccessory.prototype.getBattery = function(callback) {
  debug("Get Battery Called: " + this.battery);
  callback(null, this.battery);
}
TemperatureAccessory.prototype.getLowBattery = function(callback) {
  debug("Get Low Battery Status: " + this.lowBattery);
  callback(null, this.lowBattery);
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
