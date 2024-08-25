const express = require('express');
const router = express.Router();
const { User } = require('../models');  // Ensure User model is imported

// Route to render the dashboard page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      // If the user is logged in, render the dashboard
      console.log('Dashboard accessed by:', req.session.user_id);  // Log user access with user ID
      const user = await User.findByPk(req.session.user_id);

      if (user) {
        console.log('User found for dashboard rendering:', user.first_name); // Log user found
        res.render('dashboard', {
          loggedIn: true,
          first_name: user.first_name
        });
      } else {
        console.log('No user found for the given session user ID.');
        res.redirect('/');
      }
    } else {
      // If the user is not logged in, redirect to the home/login page
      console.log('User not logged in. Redirecting to home page.'); 
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error in dashboard route:', err);  // Log any errors
    res.status(500).json(err);
  }
});

module.exports = router;
