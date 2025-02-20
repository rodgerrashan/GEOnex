#include <ESP8266WiFi.h>
#include "wifi_manager.h"
#include "env.h"

const char WIFI_SSID[] = "Ministry Of Wifi";
const char WIFI_PASSWORD[] = "ExpectoRouter";

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.println(String("Attempting to connect to SSID: ") + String(WIFI_SSID));

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nWiFi Connected!");
}
