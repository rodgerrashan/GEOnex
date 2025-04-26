#ifndef MPU_MANAGER_H
#define MPU_MANAGER_H

#include <Wire.h>
#include "MPU9250.h"

class IMUManager
{
public:
    IMUManager();
    void begin();
    void update();
    float getPitch();
    float getRoll();

private:
    MPU9250 mpu;
    float pitch, roll;
};

#endif

// #ifndef MPU_MANAGER_H
// #define MPU_MANAGER_H

// #include <Arduino.h>
// #include <Wire.h>
// #include <MPU9250_asukiaaa.h>

// class MPUManager {
// public:
//     MPUManager(uint8_t sdaPin = 21, uint8_t sclPin = 22)
//         : sdaPin(sdaPin), sclPin(sclPin), mySensor() {}

//     void begin() {
//         Serial.begin(115200);
//         Wire.begin(sdaPin, sclPin); // Initialize I2C with SDA and SCL pins
//         mySensor.setWire(&Wire);
//         mySensor.beginAccel();
//         mySensor.beginGyro();
//         mySensor.beginMag();
//     }

//     void updateTilt() {
//         mySensor.accelUpdate();
//         mySensor.gyroUpdate();
//         mySensor.magUpdate();

//         float ax = mySensor.accelX();
//         float ay = mySensor.accelY();
//         float az = mySensor.accelZ();

//         float pitch = atan2(-ax, sqrt(ay * ay + az * az)) * 180.0 / PI;
//         float roll = atan2(ay, az) * 180.0 / PI;

//         Serial.print("Pitch: ");
//         Serial.print(pitch);
//         Serial.print(" | Roll: ");
//         Serial.println(roll);

//         delay(500);
//     }

// private:
//     uint8_t sdaPin;
//     uint8_t sclPin;
//     MPU9250_asukiaaa mySensor;
// };

// #endif // MPU_MANAGER_H