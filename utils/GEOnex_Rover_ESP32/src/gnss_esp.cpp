#include "gnss_esp.h"

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

int GPSModule::getSatellites()
{
    return gps.satellites.value();
}

String GPSModule::getLocalTime(int utcOffsetHours, int utcOffsetMinutes)
{
    int hours = gps.time.hour() + utcOffsetHours;
    int minutes = gps.time.minute() + utcOffsetMinutes;
    int seconds = gps.time.second();
    int milliseconds = gps.time.centisecond() * 10; // Convert centiseconds to milliseconds

    // Handle minute overflow
    if (minutes >= 60)
    {
        minutes -= 60;
        hours += 1;
    }
    else if (minutes < 0)
    {
        minutes += 60;
        hours -= 1;
    }

    // Handle hour overflow
    if (hours >= 24)
    {
        hours -= 24;
    }
    else if (hours < 0)
    {
        hours += 24;
    }

    char timeString[15];
    sprintf(timeString, "%02d:%02d:%02d.%03d", hours, minutes, seconds, milliseconds);
    return String(timeString);
}