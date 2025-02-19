#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <NMEAGPS.h>
#include <GPSfix.h>
#include "env.h"

// WiFi credentials
const char WIFI_SSID[] = "Ministry Of Wifi";
const char WIFI_PASSWORD[] = "ExpectoRouter";

// Device name from AWS
const char THINGNAME[] = "BaseStation";

// MQTT broker host address from AWS
const char MQTT_HOST[] = "a1qulasp0wzg24-ats.iot.eu-north-1.amazonaws.com";

// MQTT topics
const char AWS_IOT_PUBLISH_TOPIC[] = "esp8266/pub";
const char AWS_IOT_SUBSCRIBE_TOPIC[] = "esp8266/sub";

// Publishing interval
const long interval = 5000;

// Timezone offset from UTC
const int8_t TIME_ZONE = -5;

// Last time message was sent
unsigned long lastMillis = 0;

// WiFiClientSecure object for secure communication
WiFiClientSecure net;

// X.509 certificate for the CA
BearSSL::X509List cert(cacert);

// X.509 certificate for the client
BearSSL::X509List client_crt(client_cert);

// RSA private key
BearSSL::PrivateKey key(privkey);

// MQTT client instance
PubSubClient client(net);


// GPS instance
NMEAGPS gps;
gps_fix fix;

// Function to connect to NTP server and set time
void NTPConnect() {
  // Set time using SNTP
  Serial.print("Setting time using SNTP");
  configTime(TIME_ZONE * 3600, 0, "pool.ntp.org", "time.nist.gov");
  time_t now = time(nullptr);
  while (now < 1510592825) { // January 13, 2018
    delay(500);
    Serial.print(".");
    now = time(nullptr);
  }
  Serial.println("done!");
}

// Callback function for message reception
void messageReceived(char *topic, byte *payload, unsigned int length) {
  Serial.print("Received [");
  Serial.print(topic);
  Serial.print("]: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

// Function to connect to AWS IoT Core
void connectAWS() {
  delay(3000);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println(String("Attempting to connect to SSID: ") + String(WIFI_SSID));

  // Wait for WiFi connection
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nWiFi Connected!");

  // Connect to NTP server to set time
  NTPConnect();

  // Set CA and client certificate for secure communication
  net.setTrustAnchors(&cert);
  net.setClientRSACert(&client_crt, &key);

  // Connect MQTT client to AWS IoT Core
  client.setServer(MQTT_HOST, 8883);
  Serial.println("Connecting to AWS IoT...");
  // client.setCallback(messageReceived);

  // Attempt to connect to AWS IoT Core
  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(1000);
  }

  // Check if connection is successful
  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to MQTT topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  Serial.println("AWS IoT Connected!");
}

void publishGPSData() {
  
  while (gps.available(Serial1)) {  // Read GPS data from Serial1
  Serial.print("GPS is available");
    fix = gps.read();
    
    Serial.println("GPS Data:");
    if (fix.valid.location) {
      Serial.print("Latitude: "); Serial.println(fix.latitude(), 6);
      Serial.print("Longitude: "); Serial.println(fix.longitude(), 6);
    }
    if (fix.valid.altitude) {
      Serial.print("Altitude: "); Serial.print(fix.altitude()); Serial.println(" m");
    }
    if (fix.valid.speed) {
      Serial.print("Speed: "); Serial.print(fix.speed_kph()); Serial.println(" kph");
    }
    if (fix.valid.heading) {
      Serial.print("Heading: "); Serial.print(fix.heading()); Serial.println(" degrees");
    }
    if (fix.valid.satellites) {
      Serial.print("Satellites: "); Serial.println(fix.satellites);
    }
    if (fix.valid.date) {
      Serial.print("Date: "); Serial.print(fix.dateTime.year);
      Serial.print("/"); Serial.print(fix.dateTime.month);
      Serial.print("/"); Serial.println(fix.dateTime.date);
    }
    if (fix.valid.time) {
      Serial.print("Time: "); Serial.print(fix.dateTime.hours);
      Serial.print(":"); Serial.print(fix.dateTime.minutes);
      Serial.print(":"); Serial.println(fix.dateTime.seconds);
    }

    // Create JSON payload
    StaticJsonDocument<200> doc;
    doc["latitude"] = fix.latitude();
    doc["longitude"] = fix.longitude();
    doc["altitude"] = fix.altitude();
    doc["speed"] = fix.speed_kph();
    doc["heading"] = fix.heading();
    doc["satellites"] = fix.satellites;
    doc["time"] = millis();

    char jsonBuffer[200];
    serializeJson(doc, jsonBuffer);

    client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
    Serial.println("GPS Data Published to AWS!");
  }
}


void setup() {
  Serial.begin(115200);   // Debug Serial (USB)
  Serial1.begin(9600);    // GPS Serial (if connected to UART)
  // Connect to AWS IoT Core
  connectAWS();
}

void loop() {
  if (Serial1.available()) {
    Serial.write(Serial1.read()); // Print raw GPS data
  }

  if (client.connected()) {
    publishGPSData();
  }
  delay(2000);
  client.loop();
}