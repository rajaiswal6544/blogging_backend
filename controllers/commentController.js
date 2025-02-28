const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = new Comment({
            post: req.params.postId,
            author: req.user.id,
            content
        });
        await newComment.save();
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username email');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
