// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.send('Welcome to the Index Page!');
});

module.exports = router;
