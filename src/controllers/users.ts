import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User, schema } from '../models/user'

const router = express.Router()

// WARNING: needs to be admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    if (users) {
      res.status(200).json({
        ok: true,
        msg: 'Users founded',
        result: { users: [...users] },
      })
    } else {
      res.status(404).json({
        ok: false,
        msg: 'No users founded',
      })
    }
  } catch (err) {
    res.status(404).json({
      ok: false,
      msg: 'No users founded',
      result: err,
    })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('entries')
    if (user) {
      res.status(200).json({
        ok: true,
        msg: 'User founded',
        result: user,
      })
    } else {
      res.status(404).json({
        ok: false,
        msg: 'No users founded',
      })
    }
  } catch (err) {
    res.status(404).json({
      ok: false,
      msg: 'No users founded',
      result: err,
    })
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    // checks for validation errors
    schema.validate(req.body).then(async () => {
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
        result: user,
      }))
    }).catch((err: { errors?: string }) => res.status(400).json({
      ok: false,
      msg: 'Validation error',
      result: err.errors,
    }))
  } catch (err: unknown) {
    res.status(500).json({
      ok: false,
      msg: 'The user could not be created',
      result: err,
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    // checks if the email is valid
    const user = await User.findOne({
      email: req.body.email,
    })
    // if the email exists, the func ends here
    if (!user) return res.status(400).json('Invalid email or password')

    // compares passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid email or password',
      })
    }

    // generate token and set it to expire in 1 year
    const token = jwt.sign({ _id: user.id }, process.env.JWT_PRIVATE_KEY as string, {
      expiresIn: '30d',
    })
    // return token in a cookie
    return res
      .cookie('jwtToken', token)
      .status(200)
      .json({
        ok: true,
        msg: 'User logged',
        result: token,
      })
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The user could not be logged',
      result: err,
    })
  }
}

export default router
