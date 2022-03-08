const mongoose = require('mongoose')
const yup = require('yup')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entry',
      default: '',
    },
  ],
})

const User = mongoose.model('User', userSchema)

const validator = yup.object().shape({
  name: yup
    .string()
    .min(3, 'The name should be at least 3 characters.')
    .max(128, 'The name should not have more than 128 characters.')
    .required('The name is a required field.'),
  email: yup
    .string()
    .email('Email must be a valid email.')
    .required('The email is a required field.'),
  password: yup
    .string()
    .min(8, 'The password should be at least 8 characters.')
    .max(128, 'The password should not have more than 128 characters.')
    .required('The password is a required field.'),
})

exports.User = User
exports.schema = validator
