#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "mqtt_manager.h"
#include "env.h"
#include "wifi_manager.h"
#include <ArduinoJson.h>

WiFiClientSecure net;
BearSSL::X509List cert(cacert);
BearSSL::X509List client_crt(client_cert);
BearSSL::PrivateKey key(privkey);
PubSubClient client(net);

const char MQTT_HOST[] = "a1qulasp0wzg24-ats.iot.eu-north-1.amazonaws.com";
const char AWS_IOT_PUBLISH_TOPIC[] = "esp8266/pub";
// const char AWS_IOT_SUBSCRIBE_TOPIC[] = "esp8266/sub";

void connectMQTT() {
  client.setServer(MQTT_HOST, 8883);
  
  while (!client.connected()) {
    Serial.print(".");
    delay(1000);
  }

//   client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
  Serial.println("AWS IoT Connected!");
}


bool mqttConnected() {
  return client.connected();
}

void mqttLoop() {
  client.loop();
}
