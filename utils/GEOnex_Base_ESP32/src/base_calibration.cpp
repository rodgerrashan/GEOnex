#include <Arduino.h>
#include "gnss_esp.h"
#include "WiFi.h"
#include "TinyGPSPlus.h"
#include <BasicLinearAlgebra.h>
#include "config.h"
#include "gps_manager.h"
#include "base_corrections.h"

// Create GPS module instance

double lat_buffer[BUFFER_SIZE];
double lon_buffer[BUFFER_SIZE];
double fixedLat, fixedLon;

int i = 0;

FIXEDData computePrecisePosition(){
    FIXEDData fixeddata = { 0.0, 0.0, false };

    for (size_t i = 0; i <= BUFFER_SIZE; i++)
    {
        GPSData gpssample = processGPS();
        lat_buffer[i] = gpssample.latitude;
        lon_buffer[i] = gpssample.longitude;
        delay(500);

        if (i == BUFFER_SIZE)
        {
            fixeddata.latitude = calculateMean(lat_buffer, BUFFER_SIZE);
            fixeddata.longitude = calculateMean(lon_buffer, BUFFER_SIZE);

            Serial.println("Base Station Position Stabilized! meancalculation");
            Serial.print("Final Coordinates: ");
            Serial.print(fixeddata.latitude, 8);
            Serial.print(", ");
            Serial.println(fixeddata.longitude, 8);

            fixeddata.latitude = kalmanFilter(lat_buffer, BUFFER_SIZE);
            fixeddata.longitude = kalmanFilter(lon_buffer, BUFFER_SIZE);

            Serial.println("Base Station Position Stabilized! kalmanFilter");
            Serial.print("Final Coordinates: ");
            Serial.print(fixeddata.latitude, 8);
            Serial.print(", ");
            Serial.println(fixeddata.longitude, 8);

            fixeddata.isValid = true;
        }
    }
    return fixeddata;
}