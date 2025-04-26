#include "mpu_manager.h"
#include <Arduino.h>

IMUManager::IMUManager() : pitch(0), roll(0) {}

void IMUManager::begin()
{
    Wire.begin();
    mpu.setup(0x68);
    delay(2000);
}

void IMUManager::update()
{
    if (mpu.update())
    {
        pitch = mpu.getPitch();
        roll = mpu.getRoll();
        Serial.print("Pitch: ");
        Serial.print(pitch);
        Serial.print(", Roll: ");
        Serial.println(roll);
    }
}

float IMUManager::getPitch()
{
    return pitch;
}

float IMUManager::getRoll()
{
    return roll;
}
