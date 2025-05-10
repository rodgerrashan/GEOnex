#include <Arduino.h>
#include "battery_manager.h"
#include "config.h"

#define VOLTAGE_DIVIDER_RATIO 2.0 // Adjust if resistor values differ

void initBatteryMonitor()
{
    analogReadResolution(12); // 12-bit ADC (0-4095)
}

float readBatteryVoltage()
{
    int adc = analogRead(BATTERY_PIN);
    float voltage = (adc / 4095.0) * 3.3;   // ADC pin voltage
    float actual_voltage = voltage * VOLTAGE_DIVIDER_RATIO; // Adjust for voltage divider
    // Serial.print("[Test]  Battery Voltage: ");
    // Serial.print(actual_voltage);
    // Serial.println(" V");
    return actual_voltage;  
}

int getBatteryPercentage(float voltage)
{
    // Clamp values to expected range
    if (voltage >= 4.2)
        return 100;
    if (voltage <= 3.2)
        return 0;

    // Map 3.2V – 4.2V linearly to 0% – 100%
    int health = ((voltage - 3.2) * 100.0 / (4.2 - 3.2));
    // Serial.print("[Test]  Battery Percentage: ");
    // Serial.print(health);
    // Serial.println(" %");
    
    return health;
}