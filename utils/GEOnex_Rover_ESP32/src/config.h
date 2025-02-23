#ifndef CONFIG_H
#define CONFIG_H

// WiFi Credentials
#define WIFI_SSID "your-ssid"
#define WIFI_PASS "your-password"

// MQTT Broker
#define MQTT_BROKER "your-mqtt-broker-ip"
#define MQTT_PORT 1883
#define DEVICE_ID "rover1234"

// MQTT Topics
#define MQTT_TOPIC_COMMAND "/siteSurvey/commands/" DEVICE_ID
#define MQTT_TOPIC_DATA "/siteSurvey/data/" DEVICE_ID "/gps"

// Hardware Pins
#define GPS_RX 16
#define GPS_TX 17

// Publishing Intervals (ms)
#define PUBLISH_INTERVAL 2000  

#endif // CONFIG_H
