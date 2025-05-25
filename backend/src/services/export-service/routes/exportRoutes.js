const express = require("express");
const {ObjectId} = require('mongodb');
const { getDb } = require("../../point-service/db");
const router = express.Router();
const { getPointsByProjectId } = require("../../point-service/controllers/pointController");
const { exportToTxt, exportToPng, exportToDxf } = require("../../../utils/export");
const Point = require("../../point-service/models/Point");
const path = require("path");
const fs = require("fs").promises;

// Validation middleware for projectId
const validateProjectId = (req, res, next) => {
  const { projectId } = req.params;
  
  if (!projectId || projectId.trim() === '') {
    return res.status(400).json({ 
      message: "User ID is required",
      error: "Invalid or missing projectId parameter"
    });
  }
  
  // Optional: Add additional validation for projectId format
  if (!/^[a-zA-Z0-9_-]+$/.test(projectId)) {
    return res.status(400).json({
      message: "Invalid user ID format",
      error: "User ID can only contain alphanumeric characters, hyphens, and underscores"
    });
  }
  
  next();
};

// Helper function to handle file cleanup
const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Failed to cleanup temporary file: ${filePath}`, error.message);
  }
};


// Export TXT
router.get("/txt/:projectId", validateProjectId, async (req, res) => {
  let filePath = null;
  
  try {
    const { projectId} = req.params;
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    const db = getDb();
    const cursor = await db.collection('points').find({ 
      ProjectId: new ObjectId(projectId) 
    });
    const points = await cursor.toArray();
    
    if (!points || points.length === 0) {
      return res.status(404).json({ 
        message: "No points found for the specified user",
        projectId 
      });
    }
    
    const filename = `points-${projectId}-${Date.now()}.txt`;
    filePath = await exportToTxt(points, filename);
    
    if (!filePath || !(await fs.access(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate TXT file");
    }
    
    // Set proper headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending TXT file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
    
  } catch (err) {
    console.error("TXT export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({ 
      message: "Error generating TXT export", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
});

// Export PNG
router.get("/png/:projectId", validateProjectId, async (req, res) => {
  let filePath = null;
  
  try {
    const { projectId } = req.params;
    const points = await getPointsByProjectId(projectId);
    
    if (!points || points.length === 0) {
      return res.status(404).json({ 
        message: "No points found for the specified user",
        projectId 
      });
    }
    
    const filename = `points-${projectId}-${Date.now()}.png`;
    filePath = await exportToPng(points, filename);
    
    if (!filePath || !(await fs.access(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate PNG file");
    }
    
    // Set proper headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending PNG file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
    
  } catch (err) {
    console.error("PNG export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({ 
      message: "Error generating PNG export", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
});

// Export DXF
router.get("/dxf/:projectId", validateProjectId, async (req, res) => {
  let filePath = null;
  
  try {
    const { projectId } = req.params;
    const points = await getPointsByProjectId(projectId);
    
    if (!points || points.length === 0) {
      return res.status(404).json({ 
        message: "No points found for the specified user",
        projectId 
      });
    }
    
    const filename = `points-${projectId}-${Date.now()}.dxf`;
    filePath = await exportToDxf(points, filename);
    
    if (!filePath || !(await fs.access(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate DXF file");
    }
    
    // Set proper headers
    res.setHeader('Content-Type', 'application/dxf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending DXF file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
    
  } catch (err) {
    console.error("DXF export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({ 
      message: "Error generating DXF export", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    service: "Export Router",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;