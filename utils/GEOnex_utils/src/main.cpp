#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <NewPing.h>

// Wi-Fi Credentials
const char *ssid = "Ministry Of Wifi";
const char *password = "ExpectoRouter";

// MQTT Broker details
const char *mqtt_server = "fe80::ee2f:8e00:1cf8:7e44%21";
const int mqtt_port = 1883;
const char *mqtt_topic = "distance";

// Ultrasonic Sensor Pins
#define TRIG_PIN D1
#define ECHO_PIN D2
#define MAX_DISTANCE 400

NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi()
{
    delay(10);
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected, IP address: " + WiFi.localIP().toString());
}

void reconnect_mqtt()
{
    while (!client.connected())
    {
        Serial.print("Connecting to MQTT... ");
        if (client.connect("ESP8266_Client_1"))
        {
            Serial.println("Connected!");
        }
        else
        {
            Serial.print("Failed (State: ");
            Serial.print(client.state());
            Serial.println("), retrying in 5s...");
            delay(5000);
        }
    }
}

void setup()
{
    Serial.begin(9600);
    setup_wifi();
    client.setServer(mqtt_server, mqtt_port);
}

void loop()
{
    if (!client.connected())
    {
        reconnect_mqtt();
    }
    client.loop();

    // Read distance
    int distance = sonar.ping_cm();

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    // Publish to MQTT topic
    char msg[10];
    snprintf(msg, sizeof(msg), "%d", distance);
    client.publish(mqtt_topic, msg);

    delay(5000);
}
