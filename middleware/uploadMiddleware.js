const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // Ensure correct path

// Ensure cloudinary instance is not undefined
if (!cloudinary || !cloudinary.uploader) {
    throw new Error("Cloudinary is not properly configured");
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'gif'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
});

const upload = multer({ storage });

module.exports = upload;
