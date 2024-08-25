const express = require('express');
const router = express.Router();
const { withGuard, withoutGuard } = require('../utils/authGuard');

// Route to render the home page with login and signup forms
router.get('/', async (req, res) => {
  try {
      if (req.session.loggedIn) {
          // If the user is logged in, render the dashboard
          const user = await User.findByPk(req.session.userId);
          console.log('Login successful:', user.first_name); // Add this line
          res.render('dashboard', {
              loggedIn: true,
              first_name: user.first_name
          });
      } else {
          // If the user is not logged in, render the home page with login/signup forms
          res.render('home', {
              loggedIn: false
          });
      }
  } catch (err) {
      res.status(500).json(err);
  }
});


module.exports = router;
