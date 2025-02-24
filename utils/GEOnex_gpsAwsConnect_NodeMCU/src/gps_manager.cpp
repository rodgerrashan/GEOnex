#include <NMEAGPS.h>
#include <GPSfix.h>
#include <ArduinoJson.h>
#include "gps_manager.h"
#include "mqtt_manager.h"
#include <Wire.h>
#include <PubSubClient.h>

extern PubSubClient client;
extern char AWS_IOT_PUBLISH_TOPIC[];

// GPS instance
NMEAGPS gps;
gps_fix fix;

void publishGPSData()
{
    while (gps.available(Serial1))
    {
        fix = gps.read();

        if (fix.valid.location)
        {
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
}
