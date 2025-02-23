#ifndef GPS_MANAGER_H
#define GPS_MANAGER_H

#include <TinyGPS++.h>
#include <HardwareSerial.h>

void processGPS();
void handleGPSLED(int sat);

#endif 
