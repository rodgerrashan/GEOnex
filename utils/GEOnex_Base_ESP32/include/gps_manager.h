#ifndef GPS_MANAGER_H
#define GPS_MANAGER_H

#include <TinyGPS++.h>
#include <HardwareSerial.h>

// Structure to hold GPS data
struct GPSData
{
    double latitude;
    double longitude;
    int satellites;
    bool isValid;
};

GPSData processGPS();
void handleGPSLED(int sat);

#endif 
