const User = require('../models/User');
const Post = require("../models/Post");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, password } = req.body;
        
        let updatedFields = { username, email };
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }
        
        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
        
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};