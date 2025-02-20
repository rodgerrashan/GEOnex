#include <TinyGPSPlus.h>
#include <ArduinoJson.h>
#include "gps_manager.h"
#include "mqtt_manager.h"
#include <Wire.h>
#include <PubSubClient.h>

extern PubSubClient client;
extern char AWS_IOT_PUBLISH_TOPIC[];

// GPS instance  
TinyGPSPlus gps;

void publishGPSData() {
    Serial.println(Serial1.available());
    while (Serial1.available()) {
        if (gps.encode(Serial1.read())) {
          float latitude = gps.location.lat();
          float longitude = gps.location.lng();
    
          if (gps.location.isValid()) {
            char payload[128];
            snprintf(payload, sizeof(payload), "{\"lat\": %.6f, \"lon\": %.6f}", latitude, longitude);
            Serial.print("Sending: ");
            Serial.println(payload);
            client.publish(AWS_IOT_PUBLISH_TOPIC, payload);
          } else {
            Serial.println("GPS Invalid");
          }
        }
        delay(1000);
    }
  }
  
