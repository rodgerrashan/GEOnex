# Smart Surveying Device

![Logo](docs/images/device.png "This is the logo")

## Overview
This project is a **Smart Land Survey System** that integrates IoT devices, a backend, and a frontend application. It provides real-time GNSS-based positioning and mapping functionalities, leveraging AWS IoT Core, MQTT, and a microservices-based backend.

## Project Structure
```
📂 Project-Root
├── 📂 frontend       # React/MERN-based web application
├── 📂 backend        # Node.js server with microservices and MQTT integration
├── 📂 utils          # C++ code for ESP32/ESP8266 IoT devices
├── 📂 docs           # Documentation and reports
└── README.md        # Project overview
```

---

## Frontend

### Technologies Used
- React.js (or MERN stack)
- Tailwind CSS
- Recharts for data visualization
- Leaflet.js for live tracking
- Axios for API requests

### Setup
```sh
cd frontend
npm install
npm start
```

### Features
- Live GPS tracking on a map
- User authentication
- Real-time updates from IoT devices

---

## Backend

### Technologies Used
- Node.js (Express.js)
- MongoDB (Atlas)
- AWS IoT Core (MQTT Broker)
- Microservices Architecture
- Docker for deployment

### Setup
```sh
cd backend
npm install
node server.js
```

### Features
- Manages IoT data (positioning, sensor logs, etc.)
- Provides API for frontend communication
- Secure authentication and authorization

---


## Database Structure - MongoDB ER Model

### Overview

This project utilizes a MongoDB-based NoSQL database optimized for a document-oriented approach. The system efficiently manages Users, Projects, Points, and Devices by leveraging references between collections and embedding where appropriate to ensure scalability and flexibility.
        Users and Projects → Referenced using User_Id
        Projects and Points → Referenced using Project_Id
        Projects and Devices → Devices are embedded inside Projects

### Database Schema Design
#### User Collection

Each User document contains essential details. Projects are stored separately and referenced using User_Id.

```
{
  "User_Id": 1,
  "Email": "user@example.com",
  "Password": "hashed_password",
  "Role": "admin",
  "Created_At": "2024-02-22",
  "Last_Login": "2024-02-23"
}

```
#### Project Collection (Referenced from User)
Each Project is stored separately and references a User_Id. The Devices used in a project are embedded inside the document
```
{
  "Project_Id": 101,
  "User_Id": 1,  // Reference to User collection
  "Name": "Project 1",
  "Created_On": "2024-02-20",
  "Last_Modified": "2024-02-22",
  "Status": "Completed",
  "Survey_Time": "12:00:00",
  "Description": "Road surver day-1",
  "Total_Points": 100,
  "Devices": [
    {
      "Name": "Device A",
      "Status": "Online",
      "Type": "Base",
      "Battery_Percentage": 90,
      "Signal_Strength": "Good",
      "Last_Update": "2024-02-22",
      "Hardware_Id": 301
    }
  ]  // Embedded devices
}
```

#### Point Collection (Referenced from Project)
Each Point represents a geographic location where survey data is collected. Instead of being embedded, each Point document references a Project_Id.
```
{
  "Point_Id": 5001,
  "Project_Id": 101,  // Reference to Project collection
  "Name": "Location 1",
  "Type": "Sensor Data",
  "Latitude": 45.1234,
  "Longitude": 93.1234,
  "Survey_Id": 25,
  "Accuracy": 1.5,
  "Timestamp": "12:05:00"
}

```

#### Device (Embedded in Project)
Devices are embedded inside Projects because they are tightly coupled with them, reducing unnecessary joins.
```
{
  "Name": "Device A",
  "Status": "Online",
  "Type": "Base",
  "Battery_Percentage": 90,
  "Signal_Strength": "Good",
  "Last_Update": "2024-02-22",
  "Hardware_Id": 301
}
```
### Entity-Relationship Diagram (ERD)



## IoT Device Code (C++)

### Hardware Used
- ESP32 / ESP8266
- NEO-M8N GPS Module
- nRF24L01 (for RF communication)
- Sensors (IMU, etc.)

### Dependencies
- PlatformIO
- Libraries: **TinyGPS++**, **PubSubClient**, **WiFiClientSecure**


---

## Documentation
- **System Architecture**: Explains system components and interactions
- **API Reference**: Lists backend API endpoints
- **IoT Communication Flow**: Details MQTT topics and message formats
- **Deployment Guide**: Steps for setting up frontend, backend, and IoT devices

---

## Deployment
### Backend Deployment (EC2)
```sh
# Install dependencies
npm install

# Run server
node server.js
```

### Frontend Deployment (EC2)
```sh
npm run build
# Deploy static files
```

### IoT Device Setup
- Flash firmware to ESP32
- Connect to AWS IoT Core
- Subscribe to MQTT topics

---


### Special Configurations

These projects will be automatically added into [https://projects.ce.pdn.ac.lk](). If you like to show more details about your project on this site, you can fill the parameters in the file, _/docs/index.json_

```
{
  "title": "Smart Surveying Device",
  "team": [
    {
      "name": "Jayasingha B.V.R.R",
      "email": "e20168@eng.pdn.ac.lk",
      "eNumber": "E/20/168"
    },
    {
      "name": "Malinga G.A.I",
      "email": "e20242@eng.pdn.ac.lk",
      "eNumber": "E/20/242"
    },
    {
      "name": "Padeniya S.M.N.N",
      "email": "e20276@eng.pdn.ac.lk",
      "eNumber": "E/20/276"
    },
    {
      "name": "Seneviratne G.S",
      "email": "e20369@eng.pdn.ac.lk",
      "eNumber": "E/20/369"
     }
  ],
  "supervisors": [
    {
      "name": "Dr. Isuru Nawinne",
      "email": "isurunawinne@eng.pdn.ac.lk"
    }
  ],
  "tags": ["Web", "Embedded Systems"]
}
```

Once you filled this _index.json_ file, please verify the syntax is correct. (You can use [this](https://jsonlint.com/) tool).


### Page Theme

A custom theme integrated with this GitHub Page, which is based on [github.com/cepdnaclk/eYY-project-theme](https://github.com/cepdnaclk/eYY-project-theme). If you like to remove this default theme, you can remove the file, _docs/\_config.yml_ and use HTML based website.



## Contributing
- Fork the repository
- Create a new branch (`feature-xyz`)
- Submit a pull request

## License
NaN
