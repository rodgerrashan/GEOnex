#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"

// Create GPS module instance
// GPSModule gpsModule(4, 5, 9600);
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

  gpsModule.processGPSData();
  // mqttLoop();

  if (gpsModule.hasNewLocation())
  {
    Serial.println("=== GPS Data ===");
    Serial.print("Latitude: ");
    Serial.println(gpsModule.getLatitude(), 6);
    Serial.print("Longitude: ");
    Serial.println(gpsModule.getLongitude(), 6);
    Serial.print("Altitude: ");
    Serial.print(gpsModule.getAltitude(), 2);
    Serial.println(" m");
    Serial.print("Speed: ");
    Serial.print(gpsModule.getSpeed(), 2);
    Serial.println(" km/h");
    Serial.print("Satellites: ");
    Serial.println(gpsModule.getSatellites());
    Serial.print("Date/Time: ");
    Serial.println(gpsModule.getDateTime());
    Serial.println("================");

    // Publish to MQTT (Uncomment if needed)
    // publishGPSData(gpsModule.getLatitude(), gpsModule.getLongitude(), gpsModule.getAltitude(), gpsModule.getSpeed());
  }
  else
  {
    Serial.println("Waiting for GPS fix...");
  }

  mqttLoop();
  delay(2000);
}
