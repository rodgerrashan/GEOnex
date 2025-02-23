#ifndef CONFIG_H
#define CONFIG_H

// Serial Communications
#define SERIAL_BAUD_RATE 115200
#define GNSS_BAUD_RATE 9600


// WiFi Credentials
#define WIFI_SSID "Ministry Of Wifi"
#define WIFI_PASS "ExpectoRouter"

// MQTT Broker
#define MQTT_HOST "a1qulasp0wzg24-ats.iot.eu-north-1.amazonaws.com"
#define MQTT_PORT 8883
#define DEVICE_ID "rover1234"

// MQTT Topics
#define MQTT_TOPIC_COMMAND "/siteSurvey/commands/" DEVICE_ID
#define MQTT_TOPIC_DATA_LIVE "/siteSurvey/data/" DEVICE_ID "/gps/live"

// Hardware Pins
#define GPS_RX 16
#define GPS_TX 17

// LED Pins
#define LED_POWER 2 // Power Indicator (Always ON)
#define LED_WIFI 4  // WiFi Status (ON if connected, blinks if connecting)
#define LED_GPS 5   // GPS RTK Fix Indicator (ON when fix, blinks in float mode)
#define LED_MQTT 18 // MQTT Publish Indicator (Blinks on publish)

// BUTTON Pins
#define BUTTON_RESET_WIFI 32 // Reset WiFi
#define BUTTON_SEND_GPS 33   // Manually Send GPS Data

// Publishing Intervals (ms)
#define PUBLISH_INTERVAL 2000  

// Delay Settings
#define POWERUP_DELAY 5000         // Delay for power-up (in milliseconds)
#define MAIN_LOOP_DELAY 2000        // Delay for main loop (in milliseconds)
#define WIFI_RETRY_DELAY 1000       // Delay for WiFi connection retries (in milliseconds)
#define MQTT_RETRY_DELAY 1000       // Delay for MQTT connection retries (in milliseconds)
#define GPS_UPDATE_DELAY 2000       // Delay between GPS updates (in milliseconds)
#define BUTTON_DEBOUNCE_DELAY 50    // Debounce delay for buttons (in milliseconds)
#define MQTT_LED_DELAY 200          // Delay for MQTT LED blink (in milliseconds)
#define GPS_LED_DELAY 200           // Delay for GPS LED blink (in milliseconds)
#define GPS_FIX_TIMEOUT 30000       // Timeout for GPS fix (in milliseconds)
#define MQTT_PUBLISH_DELAY_MOCK 1000     // Delay for MQTT publish (in milliseconds)

// GPS Settings
#define MIN_SATELLITES 3            // Minimum number of satellites required for RTK fix

// Timeouts
#define WIFI_TIMEOUT 30000          // Timeout for WiFi connection (in milliseconds)
#define MQTT_TIMEOUT 30000          // Timeout for MQTT connection (in milliseconds)


#endif // CONFIG_H



