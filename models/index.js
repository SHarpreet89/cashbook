const Category = require('./Category');
const Note = require('./Note');
const RecurringTransaction = require('./RecurringTransaction');
const Transaction = require('./Transaction');
const User = require('./User');

User.hasMany(Transaction, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(User, {
  foreignKey: 'transaction_id',
  onDelete: 'CASCADE',
});

Transaction.hasOne(Note, {
  foreignKey: 'transaction_id',
  onDelete: 'CASCADE',
});

Note.hasOne(Transaction, {
  foreignKey: 'note_id',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(Category, {
  foreignKey: 'transaction_id',
  onDelete: 'CASCADE',
});

Category.hasMany(Transaction, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

User.hasMany(Note, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Note.belongsTo(User, {
  foreignKey: 'note_id',
  onDelete: 'CASCADE',
});

RecurringTransaction.belongsTo(User, {
  foreignKey: 'recurringtransaction_id',
  onDelete: 'CASCADE',
});

User.hasMany(RecurringTransaction, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Category.hasOne(User, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

User.hasMany(Category, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Note, Transaction, RecurringTransaction, Category };
