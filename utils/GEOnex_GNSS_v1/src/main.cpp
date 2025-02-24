#include <Arduino.h>
#include "gnss_esp32.h"
#include "WiFi.h"

// Create GPS module instance
GPSModule gpsModule(16, 17, 9600);

void setup()
{
  Serial.begin(115200);

  // Disable WiFi to stop debug messages
  WiFi.mode(WIFI_OFF);
  WiFi.disconnect(true);

  Serial.println("WiFi disabled. Now running GPS...");
  Serial.println("ESP32 GPS Module Test");
}

void loop()
{
  gpsModule.processGPSData();

  if (gpsModule.hasNewLocation())
  {
    Serial.print("Latitude: ");
    double Lat = gpsModule.getLatitude();
    Serial.print(Lat, 6);

    Serial.print(", Longitude: ");
    double Lon = gpsModule.getLongitude();
    Serial.println(Lon, 6);
  }
}
