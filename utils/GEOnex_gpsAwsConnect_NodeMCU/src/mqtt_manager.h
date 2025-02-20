#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

void connectMQTT();
void publishGPSData();
bool mqttConnected();
void mqttLoop();

#endif
