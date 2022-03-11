const mongoose = require('mongoose');
const yup = require('yup');

const entrySchema = new mongoose.Schema({
  category: {
    type: String,
    default: 'Other',
  },
  expense: {
    type: Boolean,
  },
  amount: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry',
    required: true,
  },
});

const Entry = mongoose.model('Entry', entrySchema);

const incomes = ['Savings', 'Salary', 'Gift', 'Other'];

const expenses = [
  'Food & Drinks',
  'Shopping',
  'Groceries',
  'Transport',
  'Health',
  'Life & Entertainment',
  'Home',
  'Gift',
  'Other',
];

const schema = yup.object().shape({
  category: yup.string().required().oneOf([incomes, expenses]),
  expense: yup.boolean().required(),
  amount: yup.number().required(),
});

exports.Entry = Entry;
exports.schema = schema;
