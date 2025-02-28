const express = require("express");
const { getUserProfileWithPosts } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfileWithPosts); // Protect route

module.exports = router;
