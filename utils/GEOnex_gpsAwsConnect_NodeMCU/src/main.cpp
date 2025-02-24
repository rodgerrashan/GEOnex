#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"

void setup() {
  Serial.begin(115200);
  Serial1.begin(9600);

  // Initialize WiFi and connect to network
  connectWiFi();

  // Initialize MQTT
  connectMQTT();

}

void loop() {
  if (Serial1.available()) {
    Serial.write(Serial1.read());  // Debug: Print raw GPS data
  }

  if (mqttConnected()) {
    publishGPSData();
  }
  
  delay(2000); // Delay to manage loop frequency
  mqttLoop();
}
