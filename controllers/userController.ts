import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Request, Response } from '../types'
import { User, schema } from '../models/userModel'
import { Entry } from '../models/entryModel'

const router = express.Router()

interface UserUpdates {
  name?: string;
  email?: string;
  password?: string;
}

export const getUser = async (req: Request, res: Response) => {
  // get data only from the current user
  const user = await User.findById(req.user?._id).select('-password')
  return res.status(200).json({
    ok: true,
    msg: 'User founded',
    result: user,
  })
}

export const registerUser = async (req: Request, res: Response) => {
  // checks for validation errors
  schema
    .validate(req.body)
    .then(async () => {
      // checks if the email is valid
      let user = await User.findOne({ email: req.body.email })
      // if the email exists, the func ends here
      if (user) {
        return res.status(400).json({
          ok: false,
          msg: 'Invalid email or password',
        })
      }

      // creates the new user
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })

      // hash the password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)

      // saves the user to the database
      await user.save().then(() => res.status(200).json({
        ok: true,
        msg: 'User created',
      }))
    })
    .catch((err) => res.status(400).json({
      ok: false,
      msg: 'Validation error',
      result: err,
    }))
}

export const loginUser = async (req: Request, res: Response) => {
  // checks if the email is valid
  const user = await User.findOne({ email: req.body.email })

  // If user doesn't exist or password is invalid, return error
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      ok: false,
      msg: 'Invalid email or password',
    });
  }

  // generate token and set it to expire in 30 days
  const token = jwt.sign(
    { _id: user.id },
    process.env.JWT_PRIVATE_KEY as string,
    {
      expiresIn: '30d',
    },
  )

  return res.status(200).json({
    ok: true,
    msg: 'User logged',
    result: token,
  })
}

export const putUser = async (req: Request, res: Response) => {
  // find the user
  const user = await User.findById(req.user?._id);

  // create a new user object with updated fields (only if changed)
  const updates: UserUpdates = {};
  if (req.body.name && req.body.name !== user.name) {
    updates.name = req.body.name;
  }
  if (req.body.email && req.body.email !== user.email) {
    const emailCheck = await User.findOne({
      email: req.body.email,
    })
    // if the email exists, the func ends here
    if (emailCheck !== null) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid email or password',
      })
    }
    updates.email = req.body.email;
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10)
    updates.password = await bcrypt.hash(req.body.password, salt); // secure hashing
  }

  // update the user
  await User.findByIdAndUpdate(req.user?._id, updates).then(() => {
    res.status(200).json({
      ok: true,
      msg: 'User updated',
    })
  })
};

export const deleteUser = async (req: Request, res: Response) => {
  // ensures that the user that is trying
  // to delete has the same user that the
  // one who's logged
  await User.findByIdAndDelete(req.user?._id)

  // deletes all user entries
  await Entry.deleteMany({ user: req.user?._id })
    .then(() => res.status(200).json({
      ok: true,
      msg: 'User deleted',
    }))
    .catch((err) => res.status(404).json({
      ok: false,
      msg: 'User not founded',
      result: err,
    }))
}

export default router
