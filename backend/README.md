# IoT Site Survey Backend

## Overview
This backend is built using **Node.js (Express.js)** and follows a **microservices architecture**. It connects to **MongoDB Atlas** for data storage, integrates with **AWS IoT Core** for MQTT messaging, and provides APIs for a React frontend to manage survey projects, devices, and tracking data.

## Features
- **User Authentication** (JWT-based login/register)
- **Project Management** (CRUD operations)
- **Point Management**
- **Device Management** (Base & receiver tracking)
- **Live Tracking** (MQTT subscription from AWS IoT Core)
- **Survey Points Management**
- **Real-time updates** using **AWS IoT Core MQTT**
- **MongoDB Atlas** for data storage

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Microservices:** Each service runs independently
- **IoT Integration:** AWS IoT Core (MQTT Broker)
- **Frontend:** React.js (communicates via REST APIs & WebSockets)
- **Authentication:** JWT-based authentication

---

## API Endpoints

### **Authentication (`/auth` Microservice)**
Note: Development in progress

| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | User login |
| **GET** | `/api/auth/me` | Get logged-in user details (requires token) |
| **POST** | `/api/auth/logout` | Logout user |

### **Project Management (`/projects` Microservice)**

Note: Please only use numbers for project_id.

e.g.: Payload of `POST +/api/projects`
```bash
{
        "Project_Id": 364,
        "User_Id": 123,
        "Name": "Survey Project nasa",
        "Status": "Active",
        "Survey_Time": "22 hours",
        "Description": "A test project",
        "Total_Points": 10,
        "Devices": []  
}

```

| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/projects/` | Create a new project |
| **GET** | `/api/projects` | Get all projects of the logged-in user |
| **GET** | `/api/projects/:id` | Get project details by ID |
| **PUT** | `/api/projects/:id` | Update project details |
| **DELETE** | `/api/projects/:id` | Delete a project |

### **Device Management (`/devices` Microservice)**
Note: Not implemented
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/devices` | Register a new device |
| **GET** | `/api/devices` | Get all devices |
| **GET** | `/api/devices/:id` | Get device details |
| **PUT** | `/api/devices/:id` | Update device details |
| **DELETE** | `/api/devices/:id` | Delete a device |


### **Point Management (`/points` Microservice)**

Note: Please only use numbers for project_id and point_id.

e.g.: Payload of `POST +/api/points`

```bash
{
  "Point_Id": 5106,
  "Project_Id": 102,
  "Name": "New Location",
  "Type": "Survey Data",
  "Latitude": 40.7128,
  "Longitude": -74.0060,
  "Survey_Id": 30,
  "Accuracy": 1.0,
  "Timestamp": "14:20:00"
}

```

| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/points` | Create a new point |
| **GET** | `/api/points:projectId` | Get points of a project |
| **DELETE** | `/api/devices/:projectId/:id` | Delete a point from a project |
| **PUT** | `/api/devices/:projectId/:id` | Modify a point |
| **DELETE** | `/api/devices/:projectId` | Delete all points of a project |

### **MQTT & IoT Core (`/mqtt` Microservice)**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET** | `/mqtt/subscribe` | Subscribe to AWS IoT topics |
| **POST** | `/mqtt/publish` | Publish messages to devices |
| **GET** | `/mqtt/logs` | Get recent MQTT messages |

---

### **Web Socket Service**
The backend emits two types of events
1. `live:{deviceType}` → For tracking updates
   
   e.g.:
   ```sh
        {
        "deviceName": "rover-1",
        "deviceType": "rover",
        "action": "tracking",
        "value": "{latitude: 7.29, longitude: 80.5923, timeStamp: }",
        "status": "active"
        }
   ```
2. `corrections:{deviceType}` → For base station corrections

    e.g.:
    ```sh

            {
        "deviceName": "base-1",
        "deviceType": "base",
        "action": "corrections",
        "value":"{deltaLat: 0.1234, deltaLong: -0.1234, timeStamp: }",
        "status": "stable"
        }
    ```
   

Example frontend code for frontend dev `@NisithaPadeniya`
```sh
const socket = io("http://backend-ip:5000"); 

// live tracking updates
socket.on("live:rover", (data) => {
    console.log("Live Rover Data:", data);
});

socket.on("live:base", (data) => {
    console.log("Live Base Data:", data);
});

// base corrections
socket.on("corrections:base", (data) => {
    console.log("Base Correction Data:", data);
});

```

### **MQTT TOPICS**
An overview of the MQTT topics used in the IoT project, including details on how to subscribe to them.
`Please note this section @gssamuditha`

1. Rover Live Data
   * Topic `tracking/r/live/{deviceId}/data`
   * Description
        Subscribe to this topic to receive live data from all rovers.
    * Payload:
  ```sh
    {
    "deviceId": "rover1",
    "latitude": 45.1234,
    "longitude": 93.1234,
    "status": "active",
    "timestamp": "2025-02-27T12:05:00Z"
    }

  ```
2. Base Live Data
   * Topic `tracking/b/live/{deviceId}/data`
   * Description
        Subscribe to this topic to receive live data from all base stations. 
    * Payload:
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
   * Description
        Subscribe to this topic to receive correction data for all base stations.
    * Payload:
  ```sh
    {
    "deviceId": "rover1",
    "deltaLat": 0.1234,
    "deltaLong": 0.1234,
    "status": "stable",
    "timestamp": "2025-02-27T12:05:00Z"
    }

  ```
   



## **Setup Instructions**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/cepdnaclk/e20-3yp-GEOnex.git
cd E203YP-GEONEX
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongo-cluster
JWT_SECRET=your_jwt_secret
AWS_IOT_ENDPOINT=your_aws_iot_endpoint
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_TOPIC_ROVER_LIVE=Subscribe to all rovers
AWS_TOPIC_BASE_LIVE=Subscribe to all bases
AWS_TOPIC_BASE_CORRECTIONS=Subscribe to all bases
```

### **4️⃣ Run the Microservices**
Start each service separately using:
```sh
npm run projects
npm run points
```
Or start all services together:
```sh
npm run dev
```

---


## **Real-time Data Flow**
1️⃣ IoT device publishes data to **AWS IoT Core (MQTT)**.


2️⃣ AWS IoT forwards data to **Express backend**.


3️⃣ Backend processes & forwards data to **MongoDB**.


4️⃣ Frontend **subscribes** to updates & displays them **live**.

---

## **Contributors**
- Rodger Jay

---

## **License**
- Not yet


