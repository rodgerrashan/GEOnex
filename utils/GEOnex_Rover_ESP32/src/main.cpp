#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "wifi_manager.h"
#include "mqtt_manager.h"
#include "gps_manager.h"
#include "env.h"
#include "gnss_esp.h"
#include "pins.h"

// Create GPS module instance
GPSModule gpsModule(16, 17, 9600);

// Function prototype declaration
void setupPins();

void setup()
{
  Serial.begin(115200);

  // Set LED pins as outputs
  pinMode(LED_POWER, OUTPUT);
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_GPS, OUTPUT);
  pinMode(LED_MQTT, OUTPUT);

  // Set button pins as inputs with pull-up resistors
  pinMode(BUTTON_RESET_WIFI, INPUT_PULLUP);
  pinMode(BUTTON_SEND_GPS, INPUT_PULLUP);

  // Power LED always ON
  digitalWrite(LED_POWER, HIGH);

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

    // GPS LED: ON when RTK Fix, Blinking in Float Mode
    if (sat >= 6)
    { 
      digitalWrite(LED_GPS, HIGH);
    }
    else
    {
      digitalWrite(LED_GPS, !digitalRead(LED_GPS)); // Blink in float mode
    }

    // Blink MQTT LED when publishing GPS data
    digitalWrite(LED_MQTT, LOW);
    publishGPSData(Lat, Lon, sat);
    delay(200);
    digitalWrite(LED_MQTT, HIGH);
  }
  else
  {
    Serial.println("Waiting for GPS fix...");
  }

  // Check Button Presses
  if (digitalRead(BUTTON_RESET_WIFI) == LOW)
  {
    Serial.println("Resetting WiFi...");
    WiFi.disconnect();
    delay(500);
    connectWiFi();
  }

  if (digitalRead(BUTTON_SEND_GPS) == LOW)
  {
    Serial.println("Manual GPS Data Send");
    if (gpsModule.hasNewLocation())
    {
      publishGPSData(gpsModule.getLatitude(), gpsModule.getLongitude(), gpsModule.getSatellites());
    }
    else
    {
      Serial.println("No valid GPS data to send.");
    }
  }

    //   mockPublishGPSData();
    //   mqttLoop();
    delay(2000);
  }
