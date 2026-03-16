const express = require("express");
const router = express.Router();
const {
  getNewsUpdates,
  getNewsUpdateById,
  createNewsUpdate,
  updateNewsUpdate,
  deleteNewsUpdate,
} = require("../controllers/newsUpdateController");
const { adminAuth, auth } = require("../middleware/auth");

router.get("/", getNewsUpdates);
router.get("/:id", getNewsUpdateById);
router.post("/", auth, adminAuth, createNewsUpdate);
router.put("/:id", auth, adminAuth, updateNewsUpdate);
router.delete("/:id", auth, adminAuth, deleteNewsUpdate);

module.exports = router;
