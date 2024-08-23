const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const session = require('express-session');
require('dotenv').config();
const cors = require("cors");
const path = require("path");
const app = express();

// Enable CORS with specific options
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Adjust this to match your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 's8r2DF3tF$1nJ1vS5P6qZ8sH#7xU9pC$7wR4vH3mJ2yQ9sK0',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
    }));
// Connect to the database
connectDB();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));
// app.get("/", (req,res) =>
// {
//     res.send("Welcome to NewVerse")
// });
app.use('/upload', express.static(path.join(__dirname, '../public/uploads')));

// Routes

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/upload', express.static('upload'));
app.get('/edit-blog.html', (req, res) => {
    const postId = req.query.id;
    // Optionally use postId to fetch data if needed
    res.sendFile(path.join(__dirname, 'public', 'edit-blog.html'));
});


const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
