const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { Op } = require('sequelize');

// Route to render the settings page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      const categories = await Category.findAll({
        where: {
          [Op.or]: [{ global: true }, { user_id: req.session.user_id }],
        },
        attributes: ['id', 'name'],
      });

      res.render('settings', {
        categories: categories.map((c) => c.get({ plain: true })),
        loggedIn: true,
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;