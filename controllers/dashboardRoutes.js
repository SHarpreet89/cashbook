const express = require('express');
const router = express.Router();
const { User, Transaction, Category } = require('../models');
const { Op } = require('sequelize');

// Route to render the dashboard page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      console.log('Dashboard accessed by:', req.session.user_id);

      // Fetch all global categories and user-specific categories
      const categories = await Category.findAll({
        where: {
          [Op.or]: [
            { global: true }, // Global categories (available to all users)
            { user_id: req.session.user_id } // User-specific categories
          ],
        },
        attributes: ['id', 'name'],
        order: [['name', 'ASC']], // Optionally sort categories by name
      });

      // Fetch user data along with the last 5 transactions if the user exists
      const user = await User.findByPk(req.session.user_id, {
        attributes: ['first_name', 'last_name', 'balance'],
      });

      if (user) {
        console.log('User found for dashboard rendering:', user.first_name);

        // Fetch the last 5 transactions for the user, including category names
        const transactions = await Transaction.findAll({
          where: { user_id: req.session.user_id },
          attributes: ['name', 'amount', 'date', 'transactionType'],
          include: [
            {
              model: Category,
              attributes: ['name'],
            },
          ],
          limit: 5,
          order: [['date', 'DESC']],
        });

        // Prepare the transaction data with category names for the template
        const transactionsWithCategory = transactions.map(transaction => ({
          name: transaction.name,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType,
          categoryName: transaction.category ? transaction.category.name : 'Uncategorized', // Use category name or 'Uncategorized'
        }));

        // Render the dashboard with user data, categories, and transactions
        res.render('dashboard', {
          loggedIn: true,
          first_name: user.first_name,
          last_name: user.last_name,
          total_balance: user.balance,
          transactions: transactionsWithCategory,
          categories: categories.map(category => category.get({ plain: true })), // Pass plain category objects to the template
        });
      } else {
        console.log('No user found for the given session user ID.');
        res.redirect('/');
      }
    } else {
      console.log('User not logged in. Redirecting to home page.');
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error in dashboard route:', err);
    res.status(500).json(err);
  }
});

module.exports = router;
