#include <arduino.h>
#include <pin_manager.h>
#include <config.h>

void setupPins()
{
    Serial.println("[INFO] Setting up pins...");

    // Set LED pins as outputs
    pinMode(LED_POWER, OUTPUT);
    pinMode(LED_WIFI, OUTPUT);
    pinMode(LED_GPS, OUTPUT);
    pinMode(LED_MQTT, OUTPUT);

    // Set button pins as inputs with pull-up resistors
    pinMode(BUTTON_RESET_WIFI, INPUT_PULLUP);
    pinMode(BUTTON_SEND_GPS, INPUT_PULLUP);

    // Power LED always ON
    digitalWrite(LED_POWER, HIGH);

    Serial.println("[INFO]  Pins initialized.");
}