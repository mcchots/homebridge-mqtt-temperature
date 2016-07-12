# homebridge-mqtt-temperature
Get Temperature Sensor data via MQTT in Homebridge

Installation
--------------------
    sudo npm install -g homebridge-mqtt-temperature


Sample HomeBridge Configuration
--------------------
    {
      "bridge": {
        "name": "HomeBridge",
        "username": "CC:33:3B:D3:CE:32",
        "port": 51826,
        "pin": "321-45-123"
      },

      "description": "",

      "accessories": [
				{
          "accessory": "mqtt-temperature",
          "name": "Living Room Temperature",
          "url": "mqtt://localhost",
          "topic": "home/livingroom/temperature"
    		}
      ],

      "platforms": []
    }
