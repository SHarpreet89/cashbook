const router = require('express').Router();

// Import routes
const homeRoutes = require('./api/homeRoutes');

// Use the home routes
router.use('/', homeRoutes);

module.exports = router;
