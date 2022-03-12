const mongoose = require('mongoose');
const yup = require('yup');

const entrySchema = new mongoose.Schema({
  income: {
    type: Boolean,
  },
  amount: {
    type: Number,
  },
  category: {
    type: String,
    default: 'Other',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry',
  },
});

const Entry = mongoose.model('Entry', entrySchema);

const schema = yup.object().shape({
  income: yup.boolean().required(),
  amount: yup.number().required(),
  category: yup.string().required().when('income', {
    is: true,
    then: yup.string().oneOf(['Savings', 'Salary', 'Gift', 'Other']),
    otherwise: yup.string().oneOf([
      'Food & Drinks',
      'Shopping',
      'Groceries',
      'Transport',
      'Health',
      'Life & Entertainment',
      'Home',
      'Gift',
      'Other',
    ]),
  }),
});

exports.Entry = Entry;
exports.schema = schema;
