#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"
#include "gnss_esp.h"

// Create GPS module instance
GPSModule gpsModule(16, 17, 9600);

void setup()
{
  Serial.begin(115200);

  // Initialize WiFi and connect to network
  connectWiFi();

  // Initialize MQTT
  connectMQTT();

  Serial.println("ESP32 GPS Module Test");
}

void loop()
{


  gpsModule.processGPSData();
  mqttLoop();

  if (gpsModule.hasNewLocation())
  {
    Serial.print("Latitude: ");
    double Lat = gpsModule.getLatitude();
    Serial.print(Lat, 6);

    Serial.print(", Longitude: ");
    double Lon = gpsModule.getLongitude();
    Serial.println(Lon, 6);

    Serial.print("Satellites: ");
    int sat = gpsModule.getSatellites();
    Serial.println(sat);
    
    publishGPSData(Lat, Lon, sat);
  }

  else
  {
    Serial.println("Waiting for GPS fix...");
  }


//   mockPublishGPSData();
//   mqttLoop();
  delay(2000);
}
