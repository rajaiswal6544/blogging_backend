const express = require("express");
const { toggleLike, getLikes, userLikedPost } = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication

const router = express.Router();

router.post("/likes/:postId", authMiddleware, toggleLike); // Toggle like
router.get("/likes/:postId", getLikes); // Get total likes for a post
router.get("/likes/:postId/user", authMiddleware, userLikedPost); // Check if a user liked the post

module.exports = router;
