const express = require('express');
const router = express.Router();
const { User, Transaction } = require('../models'); // Ensure User and Transaction models are imported

// Route to render the dashboard page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      // If the user is logged in, fetch the user's data and their last 5 transactions
      console.log('Dashboard accessed by:', req.session.user_id);  // Log user access with user ID

      // Fetch the user data along with the last 5 transactions, sorted by date
      const user = await User.findByPk(req.session.user_id, {
        attributes: ['first_name', 'balance'], // Include only relevant fields
        include: [
          {
            model: Transaction,
            attributes: ['name', 'amount', 'date', 'transactionType'], // Include only necessary transaction fields
            limit: 5,
            order: [['date', 'DESC']], // Sort by most recent transactions first
          }
        ],
      });

      if (user) {
        console.log('User found for dashboard rendering:', user.first_name); // Log user found

        // Prepare the transaction data for the template
        const transactions = user.transactions.map(transaction => ({
          name: transaction.name,
          amount: transaction.amount,
          date: transaction.date,
          transactionType: transaction.transactionType,
        }));

        // Render the dashboard with the user's balance, first name, and transactions
        res.render('dashboard', {
          loggedIn: true,
          first_name: user.first_name,
          total_balance: user.balance,
          transactions, // Pass the last 5 transactions to the template
        });
      } else {
        console.log('No user found for the given session user ID.');
        res.redirect('/');
      }
    } else {
      // If the user is not logged in, redirect to the home/login page
      console.log('User not logged in. Redirecting to home page.'); 
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error in dashboard route:', err);  // Log any errors
    res.status(500).json(err);
  }
});

module.exports = router;
