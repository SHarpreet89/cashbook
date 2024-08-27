const express = require('express');
const router = express.Router();
const { Transaction, Category } = require('../models');
const { Op } = require('sequelize');

// Route to render the transactions page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      console.log('Fetching transactions for user:', req.session.user_id);

      const transactions = await Transaction.findAll({
        where: { user_id: req.session.user_id },
        include: [
          {
            model: Category,
            attributes: ['name'],
          },
        ],
        order: [['date', 'DESC']],
      });

      console.log('Transactions fetched:', transactions);

      const categories = await Category.findAll({
        where: {
          [Op.or]: [{ global: true }, { user_id: req.session.user_id }],
        },
        attributes: ['id', 'name'],
      });

      console.log('Categories fetched:', categories.map(c => c.get({ plain: true })));

      const transactionsWithCategory = transactions.map((transaction) => ({
        id: transaction.id,
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        transactionType: transaction.transactionType,
        categoryName: transaction.category ? transaction.category.name : 'Uncategorized',
      }));

      res.render('transactions', {
        transactions: transactionsWithCategory,
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

module.exports = router;
