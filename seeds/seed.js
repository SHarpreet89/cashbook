const sequelize = require('../config/connection');
const { User, Category, Transaction } = require('../models');

const userData = require('./userData.json');
const categoryData = require('./categoryData.json');
const transactionData = require('./transactionData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Category.bulkCreate(categoryData);

  await Transaction.bulkCreate(transactionData);

  process.exit(0);
};

seedDatabase();
