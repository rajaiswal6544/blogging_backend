const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String }, // Store image filename or URL
    category: { 
        type: String, 
        enum: ["Technology","Health","Lifestyle","Education"], 
        required: true 
      },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
