const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
require('dotenv').config();
// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads')); // Save to public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create unique filenames
    }
});

// Initialize Multer with storage settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File upload only supports the following filetypes - ' + filetypes));
    }
});

// Create a new post
const createPost = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('File:', req.file);
        console.log('User:', req.user);

        const { title, content } = req.body;
        const image = req.file ? req.file.path.replace('public', '').replace(`\\`,'/') : null; // Remove 'public' for serving

        const newPost = new Post({
            title,
            content,
            image,
            author: {
                id: req.user.id,
                name: req.user.name
            },
            createdAt: new Date() // Ensure you have a createdAt field in your schema
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post', error });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Order by newest first
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
};

// Update a post
const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const image = req.file ? req.file.path.replace('public', '') : req.body.image;

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.image = image || post.image;

        await post.save();
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error });
    }
};

// Delete a post

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        // If there's an image, handle deletion (commented out in your case)
        // if (post.image) {
        //     // Image deletion logic here
        // }

        const result = await removePost(req.params.id);
        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in deletePost:', error);
        return res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
};
async function removePost(id) {
    let client;
    try {
        client = await MongoClient.connect("mongodb://localhost:27017/NewVerse", { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('NewVerse'); // Replace with your database name
        const result =  await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            console.error('Post not found or already deleted');
            return { success: false, message: 'Post not found or already deleted' };
        }

        console.log('Post removed successfully');
        return { success: true, message: 'Post removed successfully' };
    } catch (err) {
        console.error('Error occurred while deleting post:', err);
        throw new Error('Failed to delete post'); // You can handle this in your route
    } finally {
        if (client) {
            client.close();
        }
    }
}

// Get posts by a specific user
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ 'author.id': req.user.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user posts', error: err.message });
    }
};
const getPostForEdit = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ensure the user is the author
        if (post.author.id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to edit this post' });
        }

        res.status(200).json(post); // Return post data as JSON
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getUserPosts,
    getPostForEdit,
};