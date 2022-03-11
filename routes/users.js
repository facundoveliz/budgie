const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, schema } = require('../models/user');
const auth = require('../middleware/auth');

// FIX: needs to be admin
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      ok: true,
      msg: 'Users founded',
      result: { user: [...users] },
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      msg: 'No users founded',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      // .populate('entries')
      .exec();
    res.status(200).json({
      ok: true,
      msg: 'User founded',
      result: user,
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      msg: 'No users founded',
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    // checks for validation errors
    schema.validate(req.body).then(async () => {
      // checks if the email is valid
      let user = await User.findOne({
        email: req.body.email,
      });
      // if the email exists, the func ends here
      if (user) {
        return res.status(400).json({
          ok: false,
          msg: 'Invalid email or password',
        });
      }

      // creates the new user
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // saves the user to the database
      await user.save().then(() => res.status(200).json({
        ok: true,
        msg: 'User created',
      }));
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The user could not be created',
      result: err,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    // checks if the email is valid
    const user = await User.findOne({
      email: req.body.email,
    });
    // if the email exists, the func ends here
    if (!user) return res.status(400).json('Invalid email or password');

    // compares passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid email or password',
      });
    }

    // generate token and set it to expire in 1 year
    const token = jwt.sign({ _id: user.id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '365d',
    });
    // return token in a cookie
    return res
      .cookie('jwtToken', token)
      .status(200)
      .json({
        ok: true,
        msg: 'User logged',
        result: { token },
      });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The user could not be logged',
      result: err,
    });
  }
});

module.exports = router;
