#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"
#include "gnss_esp.h"
#include "config.h"
#include "button_manager.h"
#include "mpu_manager.h"
#include "mpu_correction.h"
#include "pin_manager.h"


IMUManager mpu(SDA, SCL);

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);

  // Configures pin modes for LEDs and buttons
  setupPins();

  // Initialize WiFi and connect to network
  connectWiFi();

  // Initialize MQTT
  connectMQTT();

  // Initialize MPU module
  mpu.begin();

  Serial.println("[INFO]  ESP32 Setup complete");
}

void loop()
{
  GPSData gpsInfo = processGPS();  // Process GPS Data

  mpu.update(); // Update MPU data test

  if (gpsInfo.isValid)
  {
    double lat = gpsInfo.latitude;
    double lon = gpsInfo.longitude;
    int satellites = gpsInfo.satellites;
    String time = gpsInfo.time;

    // Correct GPS coordinates using MPU data
    // Get pitch and roll from MPU9250
    float pitch = mpu.getPitch();
    float roll = mpu.getRoll();
    
    correctGPSCoordinates(lat, lon, pitch, roll, POLE_HEIGHT);

    publishGPSData(lat, lon, satellites, time);

    Serial.print("[Test]  Corrected GPS: ");
    Serial.print(lat, 6);
    Serial.print(", ");
    Serial.println(lon, 6);
  }

  publish_wifi_strength();

  mqttLoop();

  checkButtonPresses();

  //Main loop delay
  delay(MAIN_LOOP_DELAY);
}

