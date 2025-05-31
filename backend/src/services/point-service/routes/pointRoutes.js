const express = require("express");
const router = express.Router();
const {
  createPoint,
  getPointsByProjectId,
  deletePoint,
  modifyPoint,
  deleteAllPoints,
  renamePoint
} = require("../controllers/pointController");


router.post("/", createPoint);
router.get("/:projectId", getPointsByProjectId);
router.delete("/:projectId/:id", deletePoint);
router.put("/:projectId/:id", modifyPoint);
router.delete("/:projectId", deleteAllPoints);
router.put("/:projectId/:id/rename", renamePoint );


module.exports = router;
