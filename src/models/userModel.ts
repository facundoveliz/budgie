import mongoose from 'mongoose'
import * as Yup from 'yup'

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
})

export const User = mongoose.model('User', userSchema)

export const schema = Yup.object().shape({
  name: Yup
    .string()
    .min(3, 'The name should be at least 3 characters.')
    .max(128, 'The name should not have more than 128 characters.')
    .required('The name is a required field.'),
  email: Yup
    .string()
    .email('Email must be a valid email.')
    .required('The email is a required field.'),
  password: Yup
    .string()
    .min(8, 'The password should be at least 8 characters.')
    .max(128, 'The password should not have more than 128 characters.')
    .required('The password is a required field.'),
})
