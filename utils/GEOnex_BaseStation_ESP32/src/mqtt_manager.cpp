#include <PubSubClient.h>
#include "mqtt_manager.h"
#include "wifi_manager.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include "env.h"
#include <WiFiClientSecure.h>

WiFiClientSecure net;

PubSubClient client(net);

const char MQTT_HOST[] = "a1qulasp0wzg24-ats.iot.eu-north-1.amazonaws.com";
char AWS_IOT_PUBLISH_TOPIC[] = "esp8266/pub";
const char THINGNAME[] = "BaseStation";
const int8_t TIME_ZONE = -5;
const char AWS_IOT_SUBSCRIBE_TOPIC[] = "esp8266/sub";

// Function to connect to NTP server and set time
void NTPConnect()
{
    // Set time using SNTP
    Serial.print("Setting time using SNTP");
    configTime(TIME_ZONE * 3600, 0, "pool.ntp.org", "time.nist.gov");
    time_t now = time(nullptr);
    while (now < 1510592825)
    { // January 13, 2018
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println("done!");
}

// Function to connect to AWS IoT Core
void connectMQTT()
{
    delay(2000);

    // Connect to NTP server to set time
    NTPConnect();

    // Set CA and client certificate for secure communication
    // net.setTrustAnchors(&cert);
    // Load certificates into WiFiClientSecure
    net.setCACert(cacert);
    net.setCertificate(client_cert);
    net.setPrivateKey(privkey);

    // Connect to NTP server to set time
    NTPConnect();
    // Connect MQTT client to AWS IoT Core
    client.setServer(MQTT_HOST, 8883);
    Serial.println("Connecting to AWS IoT...");

    // Attempt to connect to AWS IoT Core
    while (!client.connect(THINGNAME))
    {
        Serial.print(".");
        delay(1000);
    }

    // Check if connection is successful
    if (!client.connected())
    {
        Serial.println("AWS IoT Timeout!");
        return;
    }

    // Subscribe to MQTT topic
    client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
    Serial.println("AWS IoT Connected!");
}

bool mqttConnected()
{
    return client.connected();
}

void mqttLoop()
{
    client.loop();
}

void publishGPSData(float latitude, float longitude, float altitude, float speed)
{
    if (!mqttConnected())
    {
        Serial.println("MQTT not connected. Attempting to reconnect...");
        connectMQTT();
    }

    StaticJsonDocument<200> jsonDoc;
    jsonDoc["latitude"] = latitude;
    jsonDoc["longitude"] = longitude;
    jsonDoc["altitude"] = altitude;
    jsonDoc["speed"] = speed;

    char jsonBuffer[256];
    serializeJson(jsonDoc, jsonBuffer);

    if (client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer))
    {
        Serial.println("GPS data published successfully");
    }
    else
    {
        Serial.println("Failed to publish GPS data");
    }
}

void mockPublishGPSData()
{
    float baseLatitude = 37.7749;
    float baseLongitude = -122.4194;
    float baseAltitude = 15.0;
    float baseSpeed = 10.5;
    
    float randomLatitude = baseLatitude + ((rand() % 100 - 50) * 0.0001);
    float randomLongitude = baseLongitude + ((rand() % 100 - 50) * 0.0001);
    float randomAltitude = baseAltitude + ((rand() % 10 - 5) * 0.1);
    float randomSpeed = baseSpeed + ((rand() % 10 - 5) * 0.1);
    
    publishGPSData(randomLatitude, randomLongitude, randomAltitude, randomSpeed);
}
