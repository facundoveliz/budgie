import mongoose from 'mongoose'
import * as Yup from 'yup'

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
    ref: 'User',
  },
})

export const Entry = mongoose.model('Entry', entrySchema)

export const schema = Yup.object().shape({
  income: Yup.boolean().required('The income is a required field.'),
  amount: Yup.number().required('The amount is a required field.'),
  category: Yup.string()
    .required('The category is a required field.')
    .when('income', {
      is: true,
      then: Yup.string().oneOf(['Savings', 'Salary', 'Gift', 'Other']),
      otherwise: Yup.string().oneOf([
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
})
