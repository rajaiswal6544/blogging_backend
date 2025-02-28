const Like = require("../models/Like");
const Post = require("../models/Post");

exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id; // Ensure authentication middleware is used

        // Check if the user already liked the post
        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            // Unlike the post
            await existingLike.deleteOne();
            return res.json({ message: "Post unliked successfully" });
        }

        // Like the post
        const newLike = new Like({ post: postId, user: userId });
        await newLike.save();

        res.json({ message: "Post liked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get total likes for a post
exports.getLikes = async (req, res) => {
    try {
        const { postId } = req.params;
        const likesCount = await Like.countDocuments({ post: postId });
        res.json({ likes: likesCount });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Check if a user liked a post
exports.userLikedPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const existingLike = await Like.findOne({ post: postId, user: userId });

        res.json({ liked: !!existingLike });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
