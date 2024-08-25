const Category = require('./Category');
const Note = require('./Note');
const Transaction = require('./Transaction');
const User = require('./User');

// User-Transaction Relations
User.hasMany(Transaction, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(User, {
  foreignKey: 'user_id',
});

// Transaction-Note Relations
Transaction.hasOne(Note, {
  foreignKey: 'transaction_id',
  onDelete: 'SET NULL',  // If the note is deleted, the transaction will have NULL as note_id
});

Note.belongsTo(Transaction, {
  foreignKey: 'transaction_id',
  onDelete: 'CASCADE',
});

// Transaction-Category Relations
Transaction.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

Category.hasMany(Transaction, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// User-Note Relations
User.hasMany(Note, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Note.belongsTo(User, {
  foreignKey: 'user_id',
});

// User-Category Relations
User.hasMany(Category, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Category.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = { User, Note, Transaction, Category };
