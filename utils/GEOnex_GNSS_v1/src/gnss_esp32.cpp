#include "gnss_esp32.h"

GPSModule::GPSModule(int rxPin, int txPin, int baudRate) : gpsSerial(2)
{
    gpsSerial.begin(baudRate, SERIAL_8N1, rxPin, txPin);
}

void GPSModule::processGPSData()
{
    while (gpsSerial.available())
    {
        gps.encode(gpsSerial.read());
    }
}

bool GPSModule::hasNewLocation()
{
    return gps.location.isUpdated();
}

double GPSModule::getLatitude()
{
    return gps.location.lat();
}

double GPSModule::getLongitude()
{
    return gps.location.lng();
}
