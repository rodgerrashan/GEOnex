// MPU9250Tilt.cpp
#include "mpu_manager.h"
#include <Wire.h>
#include <Arduino.h>

IMUManager::IMUManager(uint8_t sdaPin, uint8_t sclPin)
{
    Wire.begin(sdaPin, sclPin);
    sensor.setWire(&Wire);
}

void IMUManager::begin()
{
    sensor.beginAccel();
    sensor.beginGyro();
    sensor.beginMag();
}

void IMUManager::update()
{
    sensor.accelUpdate();
    sensor.gyroUpdate();
    sensor.magUpdate();

    float ax = sensor.accelX();
    float ay = sensor.accelY();
    float az = sensor.accelZ();

    pitch = atan2(-ax, sqrt(ay * ay + az * az)) * 180.0 / PI;
    Serial.print("[Test] Pitch: ");
    Serial.print(pitch);
    roll = atan2(ay, az) * 180.0 / PI; 
    Serial.print(" | Roll: ");
    Serial.println(roll);
}

float IMUManager::getPitch()
{
    return pitch;
}

float IMUManager::getRoll()
{
    return roll;
}

// #include "mpu_manager.h"
// #include <Arduino.h>

// IMUManager::IMUManager() : pitch(0), roll(0) {}

// void IMUManager::begin()
// {
//     Wire.begin();
//     mpu.setup(0x68);
//     delay(2000);
// }

// void IMUManager::update()
// {
//     if (mpu.update())
//     {
//         pitch = mpu.getPitch();
//         roll = mpu.getRoll();
//         Serial.print("Pitch: ");
//         Serial.print(pitch);
//         Serial.print(", Roll: ");
//         Serial.println(roll);
//     }
// }

// float IMUManager::getPitch()
// {
//     return pitch;
// }

// float IMUManager::getRoll()
// {
//     return roll;
// }
