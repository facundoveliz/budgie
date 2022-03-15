import express from 'express'
import { Request, Response } from '../types'
import { Entry, schema } from '../models/entry'
import { User } from '../models/user'

const router = express.Router()

export const getEntries = async (req: Request, res: Response) => {
  try {
    // get entries only from the current user
    // NOTE: maybe take the id from the token?
    const entries = await Entry.find({ user: req.user?._id })
    if (entries) {
      res.status(200).json({
        ok: true,
        msg: 'Entries founded',
        result: { entries: [...entries] },
      })
    } else {
      res.status(404).json({
        ok: false,
        msg: 'No entries founded',
      })
    }
  } catch (err) {
    res.status(404).json({
      ok: false,
      msg: 'No entries founded',
      result: err,
    })
  }
}

// FIX: a user can only post an entry to his account
export const postEntry = async (req: Request, res: Response) => {
  try {
    // checks for validation errors
    schema
      .validate(req.body)
      .then(async () => {
        const entry = new Entry({
          category: req.body.category,
          income: req.body.income,
          amount: req.body.amount,
          user: req.user?._id,
        })

        // NOTE: income: plus, expense: minus
        // if the number is an expense, it will change the value to negative
        if (!entry.income) {
          entry.amount = -Math.abs(entry.amount)
        }

        // FIX: fix this to it can push it to users model
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
        )
      })
      .catch((err: { errors?: string }) => res.status(400).json({
        ok: false,
        msg: 'Validation error',
        result: err.errors,
      }))
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The entry could not be created',
      result: err,
    })
  }
}

export const putEntry = async (req: Request, res: Response) => {
  try {
    schema.validate(req.body).then(async () => {
      const entry = {
        category: req.body.category,
        income: req.body.income,
        amount: req.body.amount,
      }

      // NOTE: income: plus, expense: minus
      // if the number is an expense, it will change the value to negative
      if (!entry.income) {
        entry.amount = -Math.abs(entry.amount)
      }

      await Entry.findByIdAndUpdate(req.params.id, entry).then(() => res.status(200).json({
        ok: true,
        msg: 'Entry updated',
        result: entry,
      }))
    }).catch((err: { errors?: string }) => res.status(400).json({
      ok: false,
      msg: 'Validation error',
      result: err.errors,
    }))
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The entry could not be updated',
      result: err,
    })
  }
}

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    await Entry.findByIdAndDelete(req.params.id).then(() => {
      res.status(200).json({
        ok: true,
        msg: 'Entry deleted',
      })
    })
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: 'The entry could not be deleted',
      result: err,
    })
  }
}

export default router
