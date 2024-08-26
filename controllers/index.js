const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api/');
const dashboardRoutes = require('./dashboardRoutes');
const transactionRoutes = require('./transactionRoutes');
const settingsRoutes = require('./settingsRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/transactions', transactionRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
