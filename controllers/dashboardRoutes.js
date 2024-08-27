const express = require('express');
const router = express.Router();
const { User, Transaction, Category } = require('../models'); // Ensure Category model is imported

// Route to render the dashboard page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      console.log('Dashboard accessed by:', req.session.user_id);

      // Fetch the user data along with the last 5 transactions and category names
      const user = await User.findByPk(req.session.user_id, {
        attributes: ['first_name', 'balance'],
        include: [
          {
            model: Transaction,
            attributes: ['name', 'amount', 'date', 'transactionType'],
            include: [
              {
                model: Category, // Include Category model to get category names
                attributes: ['name'],
              },
            ],
            limit: 5,
            order: [['date', 'DESC']], // Sort by most recent transactions
          }
        ],
      });

      if (user) {
        console.log('User found for dashboard rendering:', user.first_name);

        // Prepare the transaction data with category names for the template
        const transactions = user.transactions.map(transaction => ({
          name: transaction.name,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType,
          categoryName: transaction.category.name, // Add category name
        }));

        // Render the dashboard with the user's balance, first name, and transactions
        res.render('dashboard', {
          loggedIn: true,
          first_name: user.first_name,
          total_balance: user.balance,
          transactions, // Pass the transactions with category names
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
