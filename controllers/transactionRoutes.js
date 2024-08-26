const express = require('express');
const router = express.Router();

// Route to render the transactions page
router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      // You can fetch the user's transactions here if necessary
      res.render('transactions', { loggedIn: true });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
