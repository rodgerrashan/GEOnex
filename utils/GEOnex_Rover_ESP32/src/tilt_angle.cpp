#include <Arduino.h>
#include <Wire.h>
#include <MPU9250_asukiaaa.h>

MPU9250_asukiaaa mySensor;

void setup1()
{
    Serial.begin(115200);
    Wire.begin(21, 22); // SDA, SCL
    mySensor.setWire(&Wire);
    mySensor.beginAccel();
    mySensor.beginGyro();
    mySensor.beginMag();
}

void tilt()
{
    mySensor.accelUpdate();
    mySensor.gyroUpdate();
    mySensor.magUpdate();

    float ax = mySensor.accelX();
    float ay = mySensor.accelY();
    float az = mySensor.accelZ();

    float pitch = atan2(-ax, sqrt(ay * ay + az * az)) * 180.0 / PI;
    float roll = atan2(ay, az) * 180.0 / PI;

    Serial.print("Pitch: ");
    Serial.print(pitch);
    Serial.print(" | Roll: ");
    Serial.println(roll);

    delay(500);
}

// #include <Wire.h>
// #include <MPU9250.h>
// #include "gnss_esp.h"

// #define POLE_HEIGHT 1.5 // Height of the GPS pole in meters

// MPU9250 imu;
// GPSModule gpsModule(16, 17, 9600);

// void setup()
// {
//     Serial.begin(115200);
//     Wire.begin();

//     // Initialize IMU
//     imu.initialize();
//     if (!imu.testConnection())
//     {
//         Serial.println("MPU6050 not connected!");
//     }
//     else
//     {
//         Serial.println("MPU6050 initialized.");
//     }

//     // Initialize GPS
//     Serial.println("ESP32 GPS Module Test");
// }

// void loop()
// {
//     // Process GPS data
//     gpsModule.processGPSData();

//     // Read tilt angle
//     int16_t ax, ay, az;
//     imu.getAcceleration(&ax, &ay, &az);

//     // Calculate tilt angle (approximation)
//     float angle = atan2(ax, az) * 180.0 / PI;

//     // Correct GPS position
//     double Lat = gpsModule.getLatitude();
//     double Lon = gpsModule.getLongitude();
//     double offset = POLE_HEIGHT * tan(angle * PI / 180.0); // Convert to radians

//     // Apply correction (small correction in meters)
//     Lat += offset / 111320.0; // Convert meters to degrees

//     // Print corrected coordinates
//     Serial.print("Corrected Latitude: ");
//     Serial.print(Lat, 6);
//     Serial.print(", Longitude: ");
//     Serial.println(Lon, 6);

//     delay(2000);
// }
