// index.js - API Gateway (Improved Version)
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Ports of your microservices from .env
const pointsPORT = process.env.API_POINTS_PORT || 3001;
const projectsPORT = process.env.API_PROJECTS_PORT || 3002;
const authPORT = process.env.API_AUTH_PORT || 3003;
const devicePORT = process.env.API_DEVICES_PORT || 3004;
const exportPORT = process.env.API_EXPORT_PORT || 3005;
const mqttPORT = process.env.API_MQTT_PORT || 3006;
const notificationsPORT = process.env.API_NOTIFICATIONS_PORT || 3007;

// Docker service hostnames — these should match your docker-compose service names
const pointsServiceHost = process.env.POINTS_SERVICE_HOST || 'point-service';
const projectsServiceHost = process.env.PROJECTS_SERVICE_HOST || 'project-service';
const authServiceHost = process.env.AUTH_SERVICE_HOST || 'auth-service';
const devicesServiceHost = process.env.DEVICES_SERVICE_HOST || 'devices-service';
const exportServiceHost = process.env.EXPORT_SERVICE_HOST || 'export-service';
const mqttServiceHost = process.env.MQTT_SERVICE_HOST || 'mqtt-service';
const notificationsServiceHost = process.env.NOTIFICATIONS_SERVICE_HOST || 'notification-service';

// Common proxy options
const createProxyOptions = (serviceHost, servicePort, serviceName) => ({
  target: `http://${serviceHost}:${servicePort}`,
  changeOrigin: true,
  timeout: 30000, // 30 seconds
  proxyTimeout: 30000,
  pathRewrite: (path, req) => {
    // Remove the /api/servicename prefix and return the rest
    const newPath = path.replace(`/api/${serviceName.toLowerCase()}`, '');
    console.log(`Path rewrite: ${path} -> ${newPath || '/'}`);
    return newPath || '/';
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[${new Date().toISOString()}] Proxying ${req.method} ${req.originalUrl} to ${serviceHost}:${servicePort}`);
    console.log(`Target URL: http://${serviceHost}:${servicePort}${proxyReq.path}`);
    
    // Forward headers properly
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[${new Date().toISOString()}] Response from ${serviceName}: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] Proxy error for ${serviceName}:`, {
      message: err.message,
      code: err.code,
      target: `${serviceHost}:${servicePort}`,
      url: req.originalUrl,
      method: req.method
    });
    
    if (!res.headersSent) {
      res.status(503).json({
        error: `Service ${serviceName} is unavailable`,
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Proxy setup with improved error handling
app.use('/api/points', createProxyMiddleware(createProxyOptions(pointsServiceHost, pointsPORT, 'points')));
app.use('/api/projects', createProxyMiddleware(createProxyOptions(projectsServiceHost, projectsPORT, 'projects')));
app.use('/api/user', createProxyMiddleware(createProxyOptions(authServiceHost, authPORT, 'user')));
app.use('/api/users', createProxyMiddleware(createProxyOptions(authServiceHost, authPORT, 'users')));
app.use('/api/auth', createProxyMiddleware(createProxyOptions(authServiceHost, authPORT, 'auth')));
app.use('/api/devices', createProxyMiddleware(createProxyOptions(devicesServiceHost, devicePORT, 'devices')));
app.use('/api/export', createProxyMiddleware(createProxyOptions(exportServiceHost, exportPORT, 'export')));
app.use('/api/mqtt', createProxyMiddleware(createProxyOptions(mqttServiceHost, mqttPORT, 'mqtt')));
app.use('/api/notifications', createProxyMiddleware(createProxyOptions(notificationsServiceHost, notificationsPORT, 'notifications')));

// Health check endpoint with service connectivity tests
app.get('/health', async (req, res) => {
  const services = [
    { name: 'points', host: pointsServiceHost, port: pointsPORT },
    { name: 'projects', host: projectsServiceHost, port: projectsPORT },
    { name: 'auth', host: authServiceHost, port: authPORT },
    { name: 'devices', host: devicesServiceHost, port: devicePORT },
    { name: 'export', host: exportServiceHost, port: exportPORT },
    { name: 'mqtt', host: mqttServiceHost, port: mqttPORT },
    { name: 'notifications', host: notificationsServiceHost, port: notificationsPORT }
  ];

  const serviceStatus = {};
  
  for (const service of services) {
    try {
      const response = await fetch(`http://${service.host}:${service.port}/health`, {
        method: 'GET',
        timeout: 5000
      });
      serviceStatus[service.name] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        host: `${service.host}:${service.port}`
      };
    } catch (error) {
      serviceStatus[service.name] = {
        status: 'unreachable',
        error: error.message,
        host: `${service.host}:${service.port}`
      };
    }
  }

  res.json({
    status: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    services: serviceStatus,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || 5000
    }
  });
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`[${new Date().toISOString()}] Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/api/points/*',
      '/api/projects/*',
      '/api/user/*',
      '/api/users/*',
      '/api/auth/*',
      '/api/devices/*',
      '/api/export/*',
      '/api/mqtt/*',
      '/api/notifications/*',
      '/health'
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Global error:`, {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start the API Gateway
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Service Configuration:');
  console.log(`- Points: ${pointsServiceHost}:${pointsPORT}`);
  console.log(`- Projects: ${projectsServiceHost}:${projectsPORT}`);
  console.log(`- Auth: ${authServiceHost}:${authPORT}`);
  console.log(`- Devices: ${devicesServiceHost}:${devicePORT}`);
  console.log(`- Export: ${exportServiceHost}:${exportPORT}`);
  console.log(`- MQTT: ${mqttServiceHost}:${mqttPORT}`);
  console.log(`- Notifications: ${notificationsServiceHost}:${notificationsPORT}`);
  console.log('\nHealth check available at: /health');
});