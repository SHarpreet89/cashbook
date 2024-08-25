const express = require('express');
const router = express.Router();

// Route to render the settings page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.render('settings', { loggedIn: true });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
