import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Request, Response } from '../types'
import { User, schema } from '../models/userModel'

const router = express.Router()

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
      let user = await User.findOne({
        email: req.body.email,
      })
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
  const user = await User.findOne({
    email: req.body.email,
  })
  // if the email doesn't exists, the func ends here
  if (!user) {
    return res.status(400).json({
      ok: false,
      msg: 'Invalid email or password',
    })
  }

  // compares passwords
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) {
    return res.status(400).json({
      ok: false,
      msg: 'Invalid email or password',
    })
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
  // finds the user and saves the body to newUser for
  // comparing them if they are the same or for email validation
  const user = await User.findById(req.user?._id)
  const newUser = {
    name: user.name,
    email: user.email,
    password: user.password,
  }

  if (req.body.name !== user.name) newUser.name = req.body.name
  if (req.body.email !== user.email) {
    // checks if the email is exists
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
    newUser.email = req.body.email
  }
  if (req.body.password.length >= 1) {
    newUser.password = req.body.password
    // hash the password
    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)
  }

  await User.findByIdAndUpdate(req.user?._id, newUser).then(() => {
    res.status(200).json({
      ok: true,
      msg: 'User updated',
    })
  })
}

export const deleteUser = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(
    // ensures that the user that is trying
    // to delete has the same user that the
    // one who's logged
    req.user?._id,
  )
    .then(() => res.status(200).json({
      ok: true,
      msg: 'User deleted',
    }))
    .catch((err) => res.status(400).json({
      ok: false,
      msg: 'User not founded',
      result: err,
    }))
}

export default router
