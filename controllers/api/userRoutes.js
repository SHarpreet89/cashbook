const router = require('express').Router();
// Import the User model from the models folder
const { User } = require('../../models');

// If a POST request is made to /api/users, a new user is created. The user id and logged in state is saved to the session within the request object.
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.email = userData.email;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// If a POST request is made to /api/users/login, the function checks to see if the user information matches the information in the database and logs the user in. If correct, the user ID and logged-in state are saved to the session within the request object.
router.post('/login', async (req, res) => {
  console.log('Attempting to API ROUTE login user:', req.body.email);
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      console.log('No user found with that email.');
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      console.log('Incorrect password for that user.');
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err); // Debug session saving errors
        return res.status(500).json({ message: 'Failed to save session' });
      }

      req.session.user_id = userData.id;
      req.session.logged_in = true;

      console.log('Session saved successfully:', {
        sessionId: req.sessionID,
        userId: req.session.user_id,
        loggedIn: req.session.logged_in,
      });

      console.log('User logged in successfully:', {
        userId: userData.id,
        firstName: userData.first_name,
      }); // Log when user logs in successfully

      res.status(200).json({
        userData,
        message: 'You are now logged in!',
      });
    });
  } catch (err) {
    console.error('Login error:', err);  // Log error during login
    res.status(400).json(err);
  }
});


// If a POST request is made to /api/users/logout, the function checks the logged_in state in the request.session object and destroys that session if logged_in is true.
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
