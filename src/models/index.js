// Import all models
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

// User - Order relationship (One-to-Many)
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'CASCADE'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User - Product relationship (One-to-Many for created products)
User.hasMany(Product, {
  foreignKey: 'createdBy',
  as: 'createdProducts',
  onDelete: 'SET NULL'
});

Product.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// Export models
module.exports = {
  User,
  Product,
  Order
};
