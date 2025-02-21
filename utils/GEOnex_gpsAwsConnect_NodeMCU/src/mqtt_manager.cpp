#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "mqtt_manager.h"
#include "env.h"
#include "wifi_manager.h"
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

WiFiClientSecure net;
BearSSL::X509List cert(cacert);
BearSSL::X509List client_crt(client_cert);
BearSSL::PrivateKey key(privkey);
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
    net.setTrustAnchors(&cert);
    net.setClientRSACert(&client_crt, &key);

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
