const sequelize = require('../config/connection');
const { User, Category, Transaction } = require('../models');

const userData = require('./userData.json');
const categoryData = require('./categoryData.json');
const transactionData = require('./transactionData.json');

const seedDatabase = async () => {
  try {
    // Sync the database
    console.log('Syncing database...');
    await sequelize.sync({ force: true });

    // Seed users
    console.log('Seeding users...');
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    // Seed categories
    console.log('Seeding categories...');
    const categories = await Category.bulkCreate(categoryData, {
      returning: true,
    });

    // Create a balance tracker for each user
    const userBalances = {};

    // Seed transactions
    console.log('Seeding transactions...');
    await Promise.all(
      transactionData.map(async (transaction) => {
        const user = users.find((user) => user.id === transaction.user_id);
        const category = categories.find((cat) => cat.id === transaction.category_id);

        if (user && category) {
          await Transaction.create({
            user_id: user.id,
            name: transaction.name,
            amount: transaction.amount,
            category_id: category.id,
            transactionType: transaction.transactionType,
            recurringTransaction: transaction.recurringTransaction,
            date: transaction.date,
          });

          // Track the balance based on the transaction type
          if (!userBalances[user.id]) {
            userBalances[user.id] = 0;
          }
          if (transaction.transactionType === 'Credit') {
            userBalances[user.id] += parseFloat(transaction.amount);
          } else if (transaction.transactionType === 'Debit') {
            userBalances[user.id] -= parseFloat(transaction.amount);
          }
        }
      })
    );

    // Update user balances based on the transactions
    console.log('Updating user balances...');
    await Promise.all(
      Object.keys(userBalances).map(async (userId) => {
        const balance = userBalances[userId];
        await User.update({ balance }, { where: { id: userId } });
      })
    );

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed database:', err);
    process.exit(1);
  }
};

seedDatabase();
