#include <WiFi.h>
#include "wifi_manager.h"
#include "env.h"
#include "config.h"

void connectWiFi()
{
    delay(WIFI_RETRY_DELAY);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    Serial.println(String("[INFO]   Attempting to connect to SSID: ") + String(WIFI_SSID));

    unsigned long startTime = millis();

    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        digitalWrite(LED_WIFI, !digitalRead(LED_WIFI)); // Blink if connecting
        delay(WIFI_RETRY_DELAY);
        if (millis() - startTime >= WIFI_TIMEOUT)
        {
            Serial.println("\n[FAILED]  Failed to connect to WiFi.");
            return;
        }
    }

    Serial.println("\n[SUCCESS] WiFi Connected!");
    digitalWrite(LED_WIFI, HIGH);
}
