# IoT Site Survey Backend

## Overview
This backend is built using **Node.js (Express.js)** and follows a **microservices architecture**. It connects to **MongoDB Atlas** for data storage, integrates with **AWS IoT Core** for MQTT messaging, and provides APIs for a React frontend to manage survey projects, devices, and tracking data.

## Features
- **User Authentication** (JWT-based login/register)
- **Project Management** (CRUD operations)
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
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/auth/register` | Register a new user |
| **POST** | `/auth/login` | User login |
| **GET** | `/auth/me` | Get logged-in user details (requires token) |
| **POST** | `/auth/logout` | Logout user |

### **Project Management (`/projects` Microservice)**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/projects` | Create a new project |
| **GET** | `/projects` | Get all projects of the logged-in user |
| **GET** | `/projects/:id` | Get project details by ID |
| **PUT** | `/projects/:id` | Update project details |
| **DELETE** | `/projects/:id` | Delete a project |

### **Device Management (`/devices` Microservice)**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/devices` | Register a new device |
| **GET** | `/devices` | Get all devices |
| **GET** | `/devices/:id` | Get device details |
| **PUT** | `/devices/:id` | Update device details |
| **DELETE** | `/devices/:id` | Delete a device |

### **Live Tracking (`/tracking` Microservice)**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET** | `/tracking/devices` | Get all connected devices & their status |
| **GET** | `/tracking/device/:id` | Get real-time location of a device |
| **GET** | `/tracking/project/:projectId` | Get live updates for a project |

### **MQTT & IoT Core (`/mqtt` Microservice)**
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET** | `/mqtt/subscribe` | Subscribe to AWS IoT topics |
| **POST** | `/mqtt/publish` | Publish messages to devices |
| **GET** | `/mqtt/logs` | Get recent MQTT messages |

---

## **Setup Instructions**

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/iot-survey-backend.git
cd iot-survey-backend
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
```

### **4️⃣ Run the Microservices**
Start each service separately using:
```sh
npm run auth
npm run projects
npm run devices
npm run tracking
npm run mqtt
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


