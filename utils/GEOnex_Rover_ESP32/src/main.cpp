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
  // Process GPS Data
  GPSData gpsInfo = processGPS();
  // Update MPU data test
  mpu.update();

  if (gpsInfo.isValid)
  {
    double lat = gpsInfo.latitude;
    double lon = gpsInfo.longitude;

    publishGPSData(gpsInfo.latitude, gpsInfo.longitude, gpsInfo.satellites, gpsInfo.time);

    // Get pitch and roll from MPU9250
    float pitch = mpu.getPitch();
    float roll = mpu.getRoll();
    
    correctGPSCoordinates(lat, lon, pitch, roll, POLE_HEIGHT);

    Serial.print("Corrected GPS: ");
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

