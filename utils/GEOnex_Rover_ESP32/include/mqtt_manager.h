#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <Arduino.h>

void connectMQTT();
void publishGPSData(float latitude, float longitude, int satellites, String time);

bool mqttConnected();
void mqttLoop();
void mockPublishGPSData();
void handleMQTTLED() ;

#endif
