const express = require('express');
const router = express.Router();
const { Category } = require('../models');

// Route to fetch all categories (global and user-specific)
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      // Fetch global categories and user-specific categories
      const globalCategories = await Category.findAll({
        where: { global: true },
        attributes: ['id', 'name'],
      });

      const userCategories = await Category.findAll({
        where: { user_id: req.session.user_id },
        attributes: ['id', 'name'],
      });

      // Combine categories
      const categories = [...globalCategories, ...userCategories];

      res.status(200).json(categories);
    } else {
      res.status(401).json({ message: 'Please log in to fetch categories' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
