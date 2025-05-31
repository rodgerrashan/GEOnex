const express = require("express");
const router = express.Router();
const {
  createPoint,
  getPointsByProjectId,
  deletePoint,
  modifyPoint,
  deleteAllPoints,
} = require("../controllers/pointController");


router.post("/", createPoint);
router.get("/:projectId", getPointsByProjectId);
router.delete("/:projectId/:id", deletePoint);
router.put("/:projectId/:id", modifyPoint);
router.delete("/:projectId", deleteAllPoints);


module.exports = router;
