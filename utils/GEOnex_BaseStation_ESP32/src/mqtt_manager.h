#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

void connectMQTT();
void publishGPSData(float latitude, float longitude, float altitude, float speed);
bool mqttConnected();
void mqttLoop();
void mockPublishGPSData()

#endif
