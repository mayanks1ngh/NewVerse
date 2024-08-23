// routes/postRoutes.js
const express = require('express');
const multer = require('multer');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postcontroller');
const { authenticateToken } = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const postController = require('../controllers/postcontroller');
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
// Create a new post (authenticated route)
router.post('/', authenticateToken, upload.single('image'),  postController.createPost);
// Get all posts (public route)
router.get('/',  postController.getAllPosts);
// Get a specific post by ID (public route)
router.get('/:id',  postController.getPostById);
// Get all posts by the logged-in user (authenticated route)
router.get('/user/posts', authenticateToken, postController.getUserPosts);
// Update a post by ID (authenticated route)
router.put('/:id', authenticateToken, upload.single('image'), postController.updatePost);
// Delete a post by ID (authenticated route)
router.delete('/:id', authenticateToken, postController.deletePost);

router.get('/:id/edit', authenticateToken, postController.getPostForEdit);
module.exports = router;
