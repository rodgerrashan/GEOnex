// #include "gps_manager.h"

// GPSModule::GPSModule(int rxPin, int txPin, int baudRate) : gpsSerial(2) // Use UART2 on ESP32
// {
//     gpsSerial.begin(baudRate, SERIAL_8N1, rxPin, txPin);
// }

// void GPSModule::processGPSData()
// {
//     while (gpsSerial.available())
//     {
//         char c = gpsSerial.read();
//         gps.encode(c); // Parse GPS data
//     }
// }

// bool GPSModule::hasNewLocation()
// {
//     return gps.location.isUpdated();
// }

// double GPSModule::getLatitude()
// {
//     return gps.location.isValid() ? gps.location.lat() : 0.0;
// }

// double GPSModule::getLongitude()
// {
//     return gps.location.isValid() ? gps.location.lng() : 0.0;
// }

// double GPSModule::getAltitude()
// {
//     return gps.altitude.isValid() ? gps.altitude.meters() : 0.0;
// }

// double GPSModule::getSpeed()
// {
//     return gps.speed.isValid() ? gps.speed.kmph() : 0.0;
// }

// int GPSModule::getSatellites()
// {
//     return gps.satellites.isValid() ? gps.satellites.value() : 0;
// }

// String GPSModule::getDateTime()
// {
//     if (gps.date.isValid() && gps.time.isValid())
//     {
//         char buffer[30];
//         sprintf(buffer, "%02d-%02d-%04d %02d:%02d:%02d",
//                 gps.date.day(), gps.date.month(), gps.date.year(),
//                 gps.time.hour(), gps.time.minute(), gps.time.second());
//         return String(buffer);
//     }
//     return "Invalid Date/Time";
// }
