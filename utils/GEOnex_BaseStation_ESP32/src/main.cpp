#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"
#include "gnss_esp32.h"

// Create GPS module instance
GPSModule gpsModule(16, 17, 9600);

void setup()
{
  Serial.begin(115200);
  // // Disable WiFi to stop debug messages
  // WiFi.mode(WIFI_OFF);
  // WiFi.disconnect(true);

  // Initialize WiFi and connect to network
  connectWiFi();

  // Initialize MQTT
  connectMQTT();
}

void loop()
{
  if (Serial.available())
  {
    Serial.write(Serial.read()); // Debug: Print raw GPS data
  }

  // if (mqttConnected())
  // {
  //   publishGPSData();
  // }

  delay(2000); // Delay to manage loop frequency
  mqttLoop();
  Serial.println("Processing GPS data...");
  gpsModule.processGPSData();

  if (gpsModule.hasNewLocation())
  {
    Serial.print("Latitude: ");
    Serial.print(gpsModule.getLatitude(), 6);
    Serial.print(", Longitude: ");
    Serial.println(gpsModule.getLongitude(), 6);
  }
}
