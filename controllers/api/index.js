const router = require('express').Router();
const userRoutes = require('./userRoutes');  // Import userRoutes

// Define routes for the different parts of your app
router.use('/user', userRoutes);   // User-related routes (login, signup, etc.)

module.exports = router;
