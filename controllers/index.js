const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api/');
const dashboardRoutes = require('./dashboardRoutes');
const transactionRoutes = require('./transactionRoutes');
const settingsRoutes = require('./settingsRoutes');
const categoryRoutes = require('./categoryRoutes'); // Add this line

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/transactions', transactionRoutes);
router.use('/settings', settingsRoutes);
router.use('/categories', categoryRoutes); // Add this line

module.exports = router;
