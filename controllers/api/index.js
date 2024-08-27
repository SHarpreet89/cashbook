const router = require('express').Router();
const userRoutes = require('./userRoutes');  // Import userRoutes
const transactionRoutes = require('./transactionRoutes');  // Import transactionRoutes

// Define routes for the different parts of your app
router.use('/user', userRoutes);   // User-related routes (login, signup, etc.)
router.use('/transactions', transactionRoutes); // Transaction-related routes

module.exports = router;
