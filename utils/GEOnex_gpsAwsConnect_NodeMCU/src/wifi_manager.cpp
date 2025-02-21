#include <ESP8266WiFi.h>
#include "wifi_manager.h"
#include "env.h"

const char WIFI_SSID[] = "Ministry Of Wifi";
const char WIFI_PASSWORD[] = "ExpectoRouter";

void connectWiFi() {
    delay(1000);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    Serial.println(String("Attempting to connect to SSID: ") + String(WIFI_SSID));

    unsigned long startTime = millis();
    const unsigned long timeout = 30000; 

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
        if (millis() - startTime >= timeout) {
            Serial.println("\nFailed to connect to WiFi.");
            return; 
        }
    }

    Serial.println("\nWiFi Connected!");
}
