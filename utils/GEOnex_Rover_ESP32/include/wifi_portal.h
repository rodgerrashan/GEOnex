#ifndef WIFI_PORTAL_ESP32_H
#define WIFI_PORTAL_ESP32_H

#include <Arduino.h>
#include <Preferences.h>

class WiFiPortalESP32
{
public:
    WiFiPortalESP32();
    void begin();
    bool connect();
    void promptCredentials();
    void clearCredentials();
    String getSSID();
    String getPassword();

private:
    Preferences preferences;
    String ssid;
    String password;

    void loadCredentials();
    void saveCredentials(const String &ssid, const String &password);
};

#endif
