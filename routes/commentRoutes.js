const express = require('express');
const { addComment, getCommentsByPost } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:postId', authMiddleware, addComment);
router.get('/:postId', getCommentsByPost);

module.exports = router;
