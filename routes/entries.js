const express = require('express');

const router = express.Router();
const { Entry, schema } = require('../models/entry');
const { User } = require('../models/user');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // get all entries and populate them with the User
    // model, but bringing only name and email
    const entries = await Entry.find().populate('user', 'name email').exec();
    res.status(200).json({
      ok: true,
      msg: 'Entries founded',
      result: { entries: [...entries] },
    });
  } catch (err) {
    res.status(404).json({
      ok: false,
      msg: 'No entries founded',
      result: err,
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    // checks for validation errors
    schema
      .validate(req.body)
      .then(async () => {
        const entry = new Entry({
          category: req.body.category,
          income: req.body.income,
          amount: req.body.amount,
          user: req.body.user,
        });

        // NOTE: income: plus, expense: minus
        // if the number is an expense, it will change the value to negative
        if (!entry.income) {
          entry.amount = -Math.abs(entry.amount);
        }

        await entry.save().then(
          // after the entry was created, we find the user
          // owner of the entry and change the balance
          await User.findByIdAndUpdate(req.body.user, {
            $inc: {
              balance: entry.amount,
            },
          }).then(() => res.status(200).json({
            ok: true,
            msg: 'Entry created',
            result: entry,
          })),
        );
      })
      .catch((err) => res.status(400).json({
        ok: false,
        msg: 'Validation error',
        result: err,
      }));
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The entry could not be created',
      result: err,
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    schema.validate(req.body).then(async () => {
      const entry = {
        category: req.body.category,
        income: req.body.income,
        amount: req.body.amount,
      };

      // NOTE: income: plus, expense: minus
      // if the number is an expense, it will change the value to negative
      if (!entry.income) {
        entry.amount = -Math.abs(entry.amount);
      }

      await Entry.findByIdAndUpdate(req.params.id, entry).then(() => res.status(200).json({
        ok: true,
        msg: 'Entry updated',
        result: entry,
      }));
    }).catch((err) => res.status(400).json({
      ok: false,
      msg: 'Validation error',
      result: err,
    }));
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The entry could not be updated',
      result: err,
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id).then(() => {
      res.status(200).json({
        ok: true,
        msg: 'Entry deleted',
      });
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The entry could not be deleted',
      result: err,
    });
  }
});

module.exports = router;
