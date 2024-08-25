const express = require('express');
const router = express.Router();

// Route to render the home page with login and signup forms
router.get('/', (req, res) => {
    res.render('home', {
        loggedIn: req.session ? req.session.loggedIn : false
    });
});

// Handle login form submission
router.post('/login', (req, res) => {
    // Login logic here
    // Redirect to dashboard on success
});

// Handle signup form submission
router.post('/signup', (req, res) => {
    // Signup logic here
    // Redirect to dashboard on success
});

module.exports = router;
