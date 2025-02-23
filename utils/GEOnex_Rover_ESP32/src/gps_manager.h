#ifndef GNSS_ESP32_H
#define GNSS_ESP32_H

#include <Arduino.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

class GPSModule
{
public:
    GPSModule(int rxPin, int txPin, int baudRate);
    void processGPSData();
    bool hasNewLocation();

    double getLatitude();
    double getLongitude();
    double getAltitude();
    double getSpeed();
    int getSatellites();
    String getDateTime();

private:
    HardwareSerial gpsSerial;
    TinyGPSPlus gps;
};

#endif // GNSS_ESP32_H
