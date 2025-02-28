const express = require('express');
const { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByCategory } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // If using Multer in memory mode

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createPost); // Upload handled via Cloudinary
router.get('/', getAllPosts);
router.get('/filter', getPostsByCategory);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
