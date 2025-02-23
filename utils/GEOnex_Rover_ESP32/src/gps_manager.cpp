#include "gps_manager.h"
#include "mqtt_manager.h"  
#include <gnss_esp.h>
#include "config.h"


GPSModule gpsModule(GPS_RX, GPS_TX, GNSS_BAUD_RATE);

void processGPS() {
  gpsModule.processGPSData();
  Serial.println("[INFO] Processing GPS data...");

  if (gpsModule.hasNewLocation()) {
    Serial.print("\nLatitude: ");
    double Lat = gpsModule.getLatitude();
    Serial.print(Lat, 6);

    Serial.print(", Longitude: ");
    double Lon = gpsModule.getLongitude();
    Serial.println(Lon, 6);

    Serial.print("Satellites: ");
    int sat = gpsModule.getSatellites();
    Serial.println(sat);

    handleGPSLED(sat);
    handleMQTTLED(Lat, Lon, sat);
  } else {
    Serial.println("[WAIT]  Waiting for GPS fix...");
  }
}

void handleGPSLED(int sat) {
  if (sat >= MIN_SATELLITES) { 
    digitalWrite(LED_GPS, HIGH);
  } else {
    digitalWrite(LED_GPS, !digitalRead(LED_GPS));  // Blink in float mode
  }
}
