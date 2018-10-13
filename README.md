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
          "refresh_topic": "home/livingroom/temperature/get"
          "batt_topic": "home/livingroom/temperature/battery",
          "charge_topic": "home/livingroom/temperature/charge",
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

`batt_topic`, `charge_topic` and `bat_low_perc` are for battery powered sensors.
 - `batt_low_perc` overrides the default 20% value.
 - `charge_topic` is for charging state. It requires values of either 0 or 1 for off and on respectively.

`refresh_topic` lets you publish to a topic to refresh the current temperature value. This is useful in cases where your device publishes infrequently and you need an update between intervals. It requires your device to monitor this topic for requests. A request will published everytime homebridge makes a request, for example on opening the app.

All seven options are are optional as well as `username` and `password` if you don't use MQTT authentication.


#### Credits

[homebridge-mqttswitch](https://github.com/ilcato/homebridge-mqttswitch)

[homebridge-mqttgaragedoor](https://github.com/tvillingett/homebridge-mqttgaragedoor)

[homebridge-ds18b20](https://github.com/DanTheMan827/homebridge-ds18b20)
