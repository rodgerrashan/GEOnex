const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`  Body: ${JSON.stringify(req.body, null, 2)}`);
  }
  next();
});

// Determine if running in Docker environment
const isDocker = process.env.DOCKER_ENV === 'true' || process.env.NODE_ENV === 'production';

// Route configuration with Docker-aware service names
const routes = {
  '/api/user': isDocker ? 'http://auth-service:5002' : 'http://localhost:5002',
  '/api/auth': isDocker ? 'http://auth-service:5002' : 'http://localhost:5002',
  '/api/devices': isDocker ? 'http://device-service:5003' : 'http://localhost:5003',
  '/api/projects': isDocker ? 'http://project-service:5004' : 'http://localhost:5004',
  '/api/points': isDocker ? 'http://point-service:5005' : 'http://localhost:5005', 
  '/api/export': isDocker ? 'http://export-service:5006' : 'http://localhost:5006',
  '/api/notifications': isDocker ? 'http://notification-service:5008' : 'http://localhost:5008',
};

// Enhanced proxy middleware with better error handling and logging
Object.keys(routes).forEach(route => {
  const target = routes[route];
  
  app.use(route, createProxyMiddleware({
    target: target,
    changeOrigin: true,
    timeout: 30000, // 30 second timeout
    proxyTimeout: 30000,
    
    // Enhanced path rewriting with logging
    pathRewrite: (path, req) => {
      const originalPath = path;
      const newPath = path;
      const finalPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
      
      console.log(`[PROXY] Path rewrite: ${originalPath} -> ${finalPath}`);
      return finalPath;
    },
    
    // Enhanced error handling
    onError: (err, req, res) => {
      const errorMsg = `Proxy error for ${route}: ${err.message}`;
      console.error(`[ERROR] ${errorMsg}`);
      
      // More specific error responses
      let statusCode = 502;
      let errorType = 'Bad Gateway';
      
      if (err.code === 'ECONNREFUSED') {
        errorType = 'Service Unavailable';
        statusCode = 503;
      } else if (err.code === 'ETIMEDOUT') {
        errorType = 'Gateway Timeout';
        statusCode = 504;
      }
      
      // Prevent multiple responses
      if (!res.headersSent) {
        res.status(statusCode).json({
          error: errorType,
          message: `Service at ${target} is ${err.code === 'ECONNREFUSED' ? 'unavailable' : 'not responding'}`,
          route: route,
          target: target,
          code: err.code,
          timestamp: new Date().toISOString()
        });
      }
    },
    
    // Enhanced request logging
    onProxyReq: (proxyReq, req, res) => {
      const targetUrl = `${target}${req.url}`;
      console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${targetUrl}`);
      
      // Log headers for debugging
      if (process.env.DEBUG_HEADERS === 'true') {
        console.log(`[PROXY] Headers:`, req.headers);
      }
    },
    
    // Response logging
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[PROXY] Response ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`);
    },
    
    // Enhanced security headers
    headers: {
      'X-Forwarded-Proto': 'http',
      'X-Forwarded-Host': req => req.get('host'),
      'X-Real-IP': req => req.ip
    }
  }));
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: isDocker ? 'docker' : 'local',
    port: PORT,
    routes: Object.keys(routes),
    routeTargets: routes,
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.json(healthData);
});

// Routes information endpoint
app.get('/routes', (req, res) => {
  res.json({
    routes: routes,
    environment: isDocker ? 'docker' : 'local',
    timestamp: new Date().toISOString()
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    error: 'Route Not Found',
    message: `The requested endpoint '${req.originalUrl}' does not exist`,
    method: req.method,
    availableRoutes: Object.keys(routes),
    suggestions: Object.keys(routes).filter(route => 
      req.originalUrl.toLowerCase().includes(route.toLowerCase().replace('/api/', ''))
    ),
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gateway service running on port ${PORT}`);
  console.log(`📍 Environment: ${isDocker ? 'Docker' : 'Local'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('\n🔗 Route mappings:');
  
  Object.keys(routes).forEach(route => {
    console.log(`   ${route.padEnd(20)} -> ${routes[route]}`);
  });
  
  console.log(`\n🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Routes info: http://localhost:${PORT}/routes`);
  console.log('\n✅ Gateway is ready to proxy requests!\n');
});