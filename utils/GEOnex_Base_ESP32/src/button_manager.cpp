#include "button_manager.h"
#include "mqtt_manager.h"
#include "wifi_manager.h"
#include "gps_manager.h"
#include "config.h"
#include <gnss_esp.h>
#include <WiFi.h>

extern GPSModule gpsModule;

void checkButtonPresses()
{
    if (digitalRead(BUTTON_RESET_WIFI) == LOW)
    {
        Serial.println("[RESET] Resetting WiFi...");
        WiFi.disconnect();
        delay(WIFI_RETRY_DELAY);
        connectWiFi();
    }

    if (digitalRead(BUTTON_SEND_GPS) == LOW)
    {
        Serial.println("[INFO]  Manual GPS Data Send");
        if (gpsModule.hasNewLocation())
        {
            publishGPSData(gpsModule.getLatitude(), gpsModule.getLongitude(), gpsModule.getSatellites());
        }
        else
        {
            Serial.println("[INFO]    No valid GPS data to send.");
        }
    }
}

void calibrationButton()
{
    if (digitalRead(BUTTON_CALIBRATION) == LOW)
    {
        Serial.println("[RESET] Resetting WiFi...");
        WiFi.disconnect();
        delay(WIFI_RETRY_DELAY);
        connectWiFi();
    }
}