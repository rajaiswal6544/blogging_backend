const express = require('express');
const { register, login ,updateUserProfile} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile/:id',authMiddleware,updateUserProfile)
module.exports = router;