#include <WiFi.h>
#include <wifi_strength.h>


// Function to get current RSSI
int get_wifi_rssi()
{
    return WiFi.RSSI();
}

// get signal quality strength
int get_signal_quality()
{
    int rssi = WiFi.RSSI();
    if (rssi <= -100)
        return 0;
    else if (rssi >= -50)
        return 100;
    else
        return 2 * (rssi + 100); // Linear approximation
}