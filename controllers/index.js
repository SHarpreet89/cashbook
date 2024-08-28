const router = require('express').Router();

const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./api/');
const dashboardRoutes = require('./dashboardRoutes');
const transactionsPageRoutes = require('./transactionsPageRoutes');
const settingsRoutes = require('./settingsRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/transactionsPage', transactionsPageRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
