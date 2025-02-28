const User = require("../models/User");
const Post = require("../models/Post");

exports.getUserProfileWithPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authentication middleware

        const user = await User.findById(userId).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }); // Fetch user posts

        res.status(200).json({ user, posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
