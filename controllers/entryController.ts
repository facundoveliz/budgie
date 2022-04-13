import express from 'express'
import { Request, Response } from '../types'
import { Entry, schema } from '../models/entryModel'
import { User } from '../models/userModel'

const router = express.Router()

export const getEntries = async (req: Request, res: Response) => {
  // get entries only from the current user
  const entries = await Entry.find({ user: req.user?._id })
  if (entries) {
    return res.status(200).json({
      ok: true,
      msg: 'Entries founded',
      result: entries,
    })
  }
  return res.status(404).json({
    ok: false,
    msg: 'No entries founded',
  })
}

export const postEntry = async (req: Request, res: Response) => {
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
      // so it can rest the value of the user balance
      if (!entry.income) {
        entry.amount = -Math.abs(entry.amount)
      }

      await entry.save().then(
        // after the entry was created, we find the user
        // owner of the entry and change the balance
        await User.findByIdAndUpdate(req.user?._id, {
          $inc: { balance: entry.amount },
        }).then(() => res
          .status(200)
          .json({ ok: true, msg: 'Entry created', result: entry })),
      )
    })
    .catch((err) => res.status(400).json({
      ok: false,
      msg: 'Validation error',
      result: err,
    }))
}

export const putEntry = async (req: Request, res: Response) => {
  schema
    .validate(req.body)
    .then(async () => {
      const entry = {
        category: req.body.category,
        income: req.body.income,
        amount: req.body.amount,
        oldAmount: req.body.oldAmount,
      }

      // NOTE: income: plus, expense: minus
      // if the number is an expense, it will change the value to negative
      // so it can rest the value of the user balance
      if (!entry.income) {
        entry.amount = -Math.abs(entry.amount)
      }

      const newEntry = await Entry.findOneAndUpdate(
        {
          // ensures that the entry that is trying
          // to update has the same user that the
          // one who's logged
          _id: req.params.id,
          user: req.user?._id,
        },
        entry,
      )
      if (newEntry) {
        await User.findByIdAndUpdate(req.user?._id, {
          $inc: {
            balance: -entry.oldAmount + entry.amount,
          },
        }).then(() => res.status(200).json({
          ok: true,
          msg: 'Entry updated',
          result: entry,
        }))
      }
    })
    .catch((err) => res.status(400).json({
      ok: false,
      msg: 'Validation error',
      result: err,
    }))
}

export const deleteEntry = async (req: Request, res: Response) => {
  const entry = await Entry.findOne({
    _id: req.params.id,
    user: req.user?._id,
  }).catch((err) => res.status(400).json({
    ok: false,
    msg: 'Entry not founded',
    result: err,
  }))
  if (entry) {
    await Entry.findOneAndDelete({
      // ensures that the entry that is trying
      // to delete has the same user that the
      // one who's logged
      _id: req.params.id,
      user: req.user?._id,
    })
      // removes the amount of the entry to the user
      .then(async () => {
        await User.findByIdAndUpdate(req.user?._id, {
          $inc: {
            balance: -entry.amount,
          },
        }).then(() => res.status(200).json({
          ok: true,
          msg: 'Entry deleted',
          result: entry,
        }))
      })
  }
}

export default router
