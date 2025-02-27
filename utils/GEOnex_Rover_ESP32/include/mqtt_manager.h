#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

void connectMQTT();
void publishGPSData(float latitude, float longitude, int satellites);

bool mqttConnected();
void mqttLoop();
void mockPublishGPSData();
void handleMQTTLED() ;

#endif
