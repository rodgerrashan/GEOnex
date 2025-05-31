// server.js - API Gateway

const express = require('express');
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Environment URLs
const pointsUrl = process.env.API_POINTS_URL;
const projectsUrl = process.env.API_PROJECTS_URL;
const userUrl = process.env.API_USER_URL;
const authUrl = process.env.API_AUTH_URL;
const deviceUrl = process.env.API_DEVICES_URL;
const exportUrl = process.env.API_EXPORT_URL;
const mqttUrl = process.env.API_MQTT_URL;
const notificationsUrl = process.env.API_NOTIFICATIONS_URL;

// Proxy setup
app.use('/api/points', createProxyMiddleware({
  target: pointsUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/points': '' }
}));

app.use('/api/projects', createProxyMiddleware({
  target: projectsUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/projects': '' }
}));

app.use('/api/users', createProxyMiddleware({
  target: userUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/auth', createProxyMiddleware({
  target: authUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/devices', createProxyMiddleware({
  target: deviceUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/devices': '' }
}));

app.use('/api/export', createProxyMiddleware({
  target: exportUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/export': '' }
}));

app.use('/api/mqtt', createProxyMiddleware({
  target: mqttUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/mqtt': '' }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: notificationsUrl,
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' }
}));

// Start the app
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
