const router = require('express').Router();
// Import the User model from the models folder
const { Transaction, Category, User } = require('../../models');

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

// Route to fetch a transaction by its ID
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching transaction by ID:', req.params.id);
      const transactionId = parseInt(req.params.id);
      const transaction = await Transaction.findByPk(transactionId);
  
      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

// Route to add a new transaction
router.post('/add', async (req, res) => {
    try {
      // Validate that the user is logged in
      console.log('Adding new transaction for user:', req.session.user_id);
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
        
        const transaction = await Transaction.findByPk(req.params.id);
        
        if (!transaction || transaction.user_id !== req.session.user_id) {
          res.status(404).json({ message: 'Transaction not found or unauthorized' });
          return;
        }
  
        const user = await User.findByPk(req.session.user_id);
  
        const oldAmount = parseFloat(transaction.amount) || 0;
        const newAmount = parseFloat(amount) || 0;
  
        if (transaction.transactionType === 'Credit') {
          user.balance -= oldAmount;
        } else {
          user.balance += oldAmount;
        }
  
        transaction.name = name;
        transaction.amount = newAmount;
        transaction.date = date;
        transaction.category_id = category_id;
        transaction.transactionType = transactionType;
        transaction.recurringTransaction = recurringTransaction;
        
        await transaction.save();
  
        if (transaction.transactionType === 'Credit') {
          user.balance += newAmount;
        } else {
          user.balance -= newAmount;
        }
  
        // Ensure balance is a valid number before saving
        if (isNaN(user.balance)) {
          console.error("User balance became NaN during transaction update. Setting to 0.");
          user.balance = 0;
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
    console.log('Deleting transaction with ID:', req.params.id);
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