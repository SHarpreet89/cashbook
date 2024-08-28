const router = require('express').Router();
const userRoutes = require('./userRoutes');  // Import userRoutes
const transactionsRoutes = require('./transactionsRoutes');  // Import transactionRoutes
const categoryRoutes = require('./categoryRoutes');  // Import categoryRoutes

// Define routes for the different parts of your app
router.use('/user', userRoutes);   // User-related routes (login, signup, etc.)
router.use('/transactions', transactionsRoutes); // Transaction-related routes
router.use('/categories', categoryRoutes); // Category-related routes

module.exports = router;
