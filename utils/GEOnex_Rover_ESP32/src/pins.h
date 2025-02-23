#ifndef PINS_H
#define PINS_H

// LED Pins
#define LED_POWER 2 // Power Indicator (Always ON)
#define LED_WIFI 4  // WiFi Status (ON if connected, blinks if connecting)
#define LED_GPS 5   // GPS RTK Fix Indicator (ON when fix, blinks in float mode)
#define LED_MQTT 18 // MQTT Publish Indicator (Blinks on publish)

// Button Pins
#define BUTTON_RESET_WIFI 32 // Reset WiFi
#define BUTTON_SEND_GPS 33   // Manually Send GPS Data

#endif
