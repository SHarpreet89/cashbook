const router = require('express').Router();
// Import the User model from the models folder
const { Transaction, Category } = require('../../models');

router.get('/', async (req, res) => {
    try {
        if (req.session.logged_in) {
            console.log('Fetching transactions for user:', req.session.user_id);
            const transactions = await Transaction.findAll({
                where: { user_id: req.session.user_id },
                include: [
                    {
                      model: Category, // Include Category model to get category names
                      attributes: ['name'],
                    },
                  ],
                order: [['date', 'DESC']],
            });
            res.status(200).json(transactions);
        } else {
            res.status(401).json({ message: 'Please log in to fetch categories' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;