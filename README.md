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
          "topic": "home/livingroom/temperature/value",
          "batt_topic: "home/livingroom/temperature/battery",
          "batt_low_perc": "33",
          "username": "username",
          "password": "password",
          "maxTemperature": "75",
          "minTemperature": "-25",
          "serial": "HMT-34932B"
        }
      ],

      "platforms": []
    }


---------------------

`maxTemperature` and `minTemperature` allow you to change the default high and low temperatures.
`serial` allows you to change the serial number to a custom value if you need it.
`batt_topic` and `bat_low_perc` are for battery powered sensors. `batt_low_perc` overrides the default 20% value.

All are optional as well as `username` and `password` if you don't use MQTT authentication.


#### Credits

[homebridge-mqttswitch](https://github.com/ilcato/homebridge-mqttswitch)

[homebridge-mqttgaragedoor](https://github.com/tvillingett/homebridge-mqttgaragedoor)

[homebridge-ds18b20](https://github.com/DanTheMan827/homebridge-ds18b20)
