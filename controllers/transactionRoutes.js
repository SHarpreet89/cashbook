const express = require('express');
const router = express.Router();
const { Transaction, User } = require('../models'); // Ensure Transaction and User models are imported

// Route to render the transactions page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      // Fetch user's transactions
      const transactions = await Transaction.findAll({
        where: { user_id: req.session.user_id },
        order: [['date', 'DESC']],
      });

      // Fetch categories from the /categories route
      const categoryResponse = await fetch('/categories', { method: 'GET' });
      const categories = await categoryResponse.json();

      res.render('transactions', {
        transactions: transactions.map((t) => t.get({ plain: true })),
        categories: categories,
        loggedIn: true,
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to add a new transaction
router.post('/add', async (req, res) => {
  try {
    if (req.session.logged_in) {
      const { name, amount, date, category_id, transactionType, recurringTransaction } = req.body;

      // Create the new transaction
      const transaction = await Transaction.create({
        user_id: req.session.user_id,
        name,
        amount,
        date,
        category_id,
        transactionType,
        recurringTransaction
      });

      // Update the user's balance
      const user = await User.findByPk(req.session.user_id);
      user.balance += transactionType === 'Credit' ? amount : -amount;
      await user.save();

      res.status(200).json(transaction);
    } else {
      res.status(401).json({ message: 'Please log in to add a transaction' });
    }
  } catch (err) {
    res.status(500).json(err);
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
