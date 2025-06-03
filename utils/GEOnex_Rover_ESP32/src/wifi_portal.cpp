#include "wifi_portal.h"
#include <WiFi.h>

WiFiPortalESP32::WiFiPortalESP32() {}

void WiFiPortalESP32::begin()
{
    loadCredentials();

    if (ssid == "" || password == "")
    {
        Serial.println("No saved credentials.");
        promptCredentials();
        loadCredentials(); // reload after saving
    }
}

bool WiFiPortalESP32::connect()
{
    WiFi.begin(ssid.c_str(), password.c_str());
    Serial.print("Connecting to Wi-Fi");

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 10000)
    {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("\nConnected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        return true;
    }
    else
    {
        Serial.println("\nFailed to connect.");
        return false;
    }
}

void WiFiPortalESP32::promptCredentials()
{
    Serial.println("Enter Wi-Fi SSID:");
    while (Serial.available() == 0)
        ;
    ssid = Serial.readStringUntil('\n');
    ssid.trim();

    Serial.println("Enter Wi-Fi Password:");
    while (Serial.available() == 0)
        ;
    password = Serial.readStringUntil('\n');
    password.trim();

    saveCredentials(ssid, password);
}

void WiFiPortalESP32::clearCredentials()
{
    preferences.begin("wifi", false);
    preferences.clear();
    preferences.end();
    Serial.println("🧽 Credentials cleared.");
}

void WiFiPortalESP32::loadCredentials()
{
    preferences.begin("wifi", true); // read-only
    ssid = preferences.getString("ssid", "");
    password = preferences.getString("password", "");
    preferences.end();
}

void WiFiPortalESP32::saveCredentials(const String &ssid, const String &password)
{
    preferences.begin("wifi", false);
    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
    preferences.end();
}

String WiFiPortalESP32::getSSID()
{
    return ssid;
}

String WiFiPortalESP32::getPassword()
{
    return password;
}
