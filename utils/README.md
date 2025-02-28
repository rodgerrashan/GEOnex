# IoT Site Survey Hardware

## Overview
This is a PlatformIO-based project for the **GEOnex Rover** and **GEOnex Base**, powered by an ESP32 microcontrollers. The project includes firmware, libraries, and configurations necessary for deployment.

## Features
- **Rover Control Data point Collection**
- **Base Station Calibration** 
- **Base Station corrections**
- **MQTT Communication** (AWS IoT Core integration)
- **Serial Monitoring Support**
- **Manual wifi reset and base Calibration**

---

## Tech Stack
- Firmware: C++ (PlatformIO)
- Hardware: ESP32
- GNSS Senser: NEO M8N
- IoT Integration: AWS IoT Core (MQTT Broker)
- Communication Protocols: MQTT, Serial

---

## Project Structure
- **src/** - Contains the main source code
- **lib/** - Additional libraries
- **include/** - Header files
- **platformio.ini** - PlatformIO configuration

---

## PIO libraries
This project uses the following PlatformIO libraries:
- **TinyGPSPlus** GPS parsing library for retrieving latitude and longitude from GPS modules.
- **PubSubClient** MQTT client for publishing and subscribing to topics.
- **WiFiClientSecure** Provides secure TLS/SSL communication over Wi-Fi for encrypted MQTT messages.
- **BasicLinearAlgebra** Matrix and vector operations (only used in Base Setup)
- **ArduinoJson** JSON serialization and deserialization library used for handling MQTT messages efficiently.

---

## MQTT JSON Upload
The project uses MQTT to transmit JSON-formatted data to a broker. The data structure is as follows:

### 1. Rover Live Data
   * Topic `MQTT_TOPIC_DATA_LIVE`
   * Instructioins
        Enter the coresponding topic to this. 
    * json Structure:
  ```sh
    {
    "deviceId": "rover1",
    "latitude": 45.1234,
    "longitude": 93.1234,
    "status": "active",
    "timestamp": "2025-02-27T12:05:00Z"
    }

  ```
### 2. Base Live Data
   * Topic `tracking/b/live/{deviceId}/data`
   * Instructioins
        Subscribe to this topic to receive live data from all base stations. 
    * json Structure:
  ```sh
    {
    "deviceId": "base2031",
    "latitude": 45.1234,
    "longitude": 93.1234,
    "status": "active",
    "timestamp": "2025-02-27T12:05:00Z"
    }

  ```
3. Base Correction Data
   * Topic `corrections/b/live/{deviceId}/data`
   * Instructioins
        Subscribe to this topic to receive correction data for all base stations.
    * json Structure:
  ```sh
    {
    "deviceId": "rover1",
    "deltaLat": 0.1234,
    "deltaLong": 0.1234,
    "status": "stable",
    "timestamp": "2025-02-27T12:05:00Z"
    }

  ```
---

## **Setup Instructions**

### **1️ Clone the Repository**
```sh
git clone https://github.com/cepdnaclk/e20-3yp-GEOnex.git
cd E203YP-GEONEX/utils
```

### **2️ Install PlatformIO**
```sh
pio run
```

### **3 Add required Libaries to the project** `platformio.ini`
```sh
lib_deps = 
	bblanchon/ArduinoJson@^7.3.0
	knolleary/PubSubClient@^2.8.0
	mikalhart/TinyGPSPlus@^1.1.0
	tomstewart89/BasicLinearAlgebra@^5.1
```
---

## **Contributors**
- Samuditha Seneviratne
- Rodger Roshan

---

## **License**
- Not yet


