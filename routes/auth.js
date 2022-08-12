const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const SECRET_KEY = 'Mynameismohammedrizwan'

// Creates an Express application. The express() function is a top-level function exported by the express module.
// create a user using : POST "api/auth/". Doesnt require auth
// no login required
// Route 1
router.post('/createuser', [
  body('email','Please enter a valid email').isEmail(),
  body('name', 'Enter a valid name ').isLength({ min: 3 }),
  body('password', 'Password must be atleast 5 characters ').isLength({ min: 5 }),
], async (req, res) => {
  //if there are errros return errors bad request
  const errors = validationResult(req);
  let success = false;

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    let user = await User.findOne({ success, email: req.body.email })
    if (user) {
      return res.status(400).json({ success, errors: "Sorry a user with this email is already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    // check whether the user with the email already exists
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email
    })

    const data = {
      user: {
        id: user.id
      }
    }
    authToken = jwt.sign(data, SECRET_KEY)
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    res.status(400).json({ success, error: "Internal server Error" });
  }
})
//Route 2
// Authenticate a user using : POST "api/auth/login". Doesnt require auth
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ success, error: "Invalid Credentials" });
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      res.status(400).json({ success, error: "Invalid Credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    success = true;
    authToken = jwt.sign(data, SECRET_KEY)
    res.json({ success, authToken });

  } catch (error) {
    res.status(400).json({ success, error: "Internal server Error",error });
  }
})

// Route 3
// Get loggedIn using Post "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = await req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(400).send("Internal server Error");
  }
})
module.exports = router;
