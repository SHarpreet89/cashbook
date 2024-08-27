const express = require('express');
const router = express.Router();
const { Transaction, Category } = require('../models'); 
const { Op } = require('sequelize'); // Make sure to import Op for query operations

// Route to render the transactions page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      console.log('Fetching transactions for user:', req.session.user_id);

      // Fetch user's transactions
      const transactions = await Transaction.findAll({
        where: { user_id: req.session.user_id },
        order: [['date', 'DESC']],
      });

      console.log('Transactions fetched:', transactions);

      // Fetch categories for the logged-in user
      const categories = await Category.findAll({
        where: {
          [Op.or]: [{ global: true }, { user_id: req.session.user_id }],
        },
        attributes: ['id', 'name'], 
      });

      console.log('Categories fetched:', categories);

      res.render('transactions', {
        transactions: transactions.map((t) => t.get({ plain: true })),
        categories: categories.map((c) => c.get({ plain: true })),
        loggedIn: true,
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error in fetching transactions and categories:', err);
    res.status(500).json(err);
  }
});

// Route to add a new transaction
router.post('/add', async (req, res) => {
  try {
    // Validate that the user is logged in
    if (!req.session.user_id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate incoming data
    const { name, amount, date, category_id, transactionType, recurringTransaction } = req.body;
    
    if (!name || !amount || !date || !category_id || !transactionType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Ensure transactionType is either 'Credit' or 'Debit'
    if (transactionType !== 'Credit' && transactionType !== 'Debit') {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Prepare the transaction data
    const transactionData = {
      user_id: req.session.user_id,
      name,
      amount,
      date,
      category_id, // Should be an integer
      transactionType,
      recurringTransaction: recurringTransaction || false,
      note_id: null // Set to null if not provided, or adjust logic as needed
    };

    // Create the transaction in the database
    const newTransaction = await Transaction.create(transactionData);

    res.status(200).json({ message: 'Transaction added successfully!', newTransaction });
  } catch (err) {
    console.error('Transaction creation failed:', err);
    res.status(500).json({ message: 'Failed to add transaction.', error: err });
  }
});

// Route to update an existing transaction
router.put('/update/:id', async (req, res) => {
  try {
    if (req.session.logged_in) {
      const { name, amount, date, category_id, transactionType, recurringTransaction } = req.body;
      
      // Find the existing transaction
      const transaction = await Transaction.findByPk(req.params.id);
      
      if (!transaction || transaction.user_id !== req.session.user_id) {
        res.status(404).json({ message: 'Transaction not found or unauthorized' });
        return;
      }

      // Adjust the balance based on the old and new amounts
      const user = await User.findByPk(req.session.user_id);
      if (transaction.transactionType === 'Credit') {
        user.balance -= transaction.amount;
      } else {
        user.balance += transaction.amount;
      }

      // Update the transaction
      transaction.name = name;
      transaction.amount = amount;
      transaction.date = date;
      transaction.category_id = category_id;
      transaction.transactionType = transactionType;
      transaction.recurringTransaction = recurringTransaction;
      
      await transaction.save();

      // Adjust the balance for the new transaction details
      if (transaction.transactionType === 'Credit') {
        user.balance += amount;
      } else {
        user.balance -= amount;
      }
      
      await user.save();

      res.status(200).json(transaction);
    } else {
      res.status(401).json({ message: 'Please log in to update a transaction' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a transaction
router.delete('/delete/:id', async (req, res) => {
  try {
    if (req.session.logged_in) {
      // Find the transaction to be deleted
      const transaction = await Transaction.findByPk(req.params.id);

      if (!transaction || transaction.user_id !== req.session.user_id) {
        res.status(404).json({ message: 'Transaction not found or unauthorized' });
        return;
      }

      // Update the user's balance before deletion
      const user = await User.findByPk(req.session.user_id);
      if (transaction.transactionType === 'Credit') {
        user.balance -= transaction.amount;
      } else {
        user.balance += transaction.amount;
      }

      await user.save();

      // Delete the transaction
      await transaction.destroy();
      
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(401).json({ message: 'Please log in to delete a transaction' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
