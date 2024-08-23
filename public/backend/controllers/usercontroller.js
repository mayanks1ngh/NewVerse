const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Use bcryptjs for better compatibility
const jwt = require('jsonwebtoken');

// Sign a JWT token
const signToken = (id,name) => {
    return jwt.sign({ id,name }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });
        
    } catch (err) {
        console.error('Error registering user:', err); // Log the error for debugging
        // Ensure only one response is sent
        if (!res.headersSent) {
            return res.status(500).json({ error: err.message });
        }
    }
};

// Login a user
exports.login = async (req, res) => {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Sign the token with user ID and name
        const token = signToken(user._id, user.name);
        console.log('Token generated:', token);

        // Respond with token and user info
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
