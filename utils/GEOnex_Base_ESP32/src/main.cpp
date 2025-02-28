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
#include "base_calibration.h"

// Function prototype declaration
void setupPins();

void setup()
{
  Serial.begin(SERIAL_BAUD_RATE);

  // Configures pin modes for LEDs and buttons
  setupPins();

  // Initialize WiFi and connect to network
  connectWiFi();

  // Initialize MQTT
  connectMQTT();

  Serial.println("[INFO]  ESP32 Setup complete");

  // Base Calibration
  FIXEDData fix = computePrecisePosition();
  if (fix.isValid)
  {
    publishBaseFix(fix.latitude, fix.longitude);
  }
}

void loop()
{
  // Process GPS Data
  GPSData gpsInfo = processGPS();
  if (gpsInfo.isValid)
  {
    publishGPSData(gpsInfo.latitude, gpsInfo.longitude, gpsInfo.satellites);
  }

  mqttLoop();

  checkButtonPresses();

  //Main loop delay
  delay(MAIN_LOOP_DELAY);
}

void setupPins()
{
  Serial.println("[INFO] Setting up pins...");

  // Set LED pins as outputs
  pinMode(LED_POWER, OUTPUT);
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_GPS, OUTPUT);
  pinMode(LED_MQTT, OUTPUT);

  // Set button pins as inputs with pull-up resistors
  pinMode(BUTTON_RESET_WIFI, INPUT_PULLUP);
  pinMode(BUTTON_SEND_GPS, INPUT_PULLUP);
  pinMode(BUTTON_CALIBRATION, INPUT_PULLUP);

  // Power LED always ON
  digitalWrite(LED_POWER, HIGH);

  Serial.println("[INFO]  Pins initialized.");
}
