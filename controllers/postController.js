const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        console.log("Uploaded file:", req.file);
        console.log("Request body:", req.body);
        console.log("User ID:", req.user?.id);

        const { title, content, category } = req.body;
        const image = req.file ? req.file.path : null; // Cloudinary URL

        if (!["Technology", "Health", "Lifestyle", "Education"].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const newPost = new Post({
            title,
            content,
            image, // Store Cloudinary URL
            category,
            author: req.user.id
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};



// Get all posts (with category support)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get posts by category (New Filter API)
exports.getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }
        if (!["Technology", "Health", "Lifestyle", "Education"].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const posts = await Post.find({ category }).populate('author', 'username email');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username email');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        let post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        if (category && !["Technology", "Health", "Lifestyle", "Education"].includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        // Handle Cloudinary image replacement
        let newImage = post.image;
        if (req.file) {
            // 🔹 Upload new image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            newImage = uploadResult.secure_url; // Get Cloudinary URL
        }

        post.title = title;
        post.content = content;
        post.image = newImage;
        post.category = category || post.category;
        await post.save();

        res.json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        // Delete Cloudinary image if exists
        if (post.image) {
            const publicId = post.image.split('/').pop().split('.')[0]; // Extract public_id from URL
            await cloudinary.uploader.destroy(publicId);
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
