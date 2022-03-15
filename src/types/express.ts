import { Request, Response, NextFunction } from 'express'

// FIX: better exports
interface IGetUserAuthInfoRequest extends Request {
  user?: {
    _id: string
    name: string,
    email: string,
    balance: number,
    created: Date,
  },
}

export { IGetUserAuthInfoRequest as Request, Response, NextFunction }
