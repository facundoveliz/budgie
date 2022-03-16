import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from '../types'
import { User } from '../models/user'

interface Decoded {
  _id: string;
  iat: Date;
  exp: Date;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  // checks if a token exists
  const token = req.cookies.jwtToken
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Access denied, no token provided',
    })
  }
  const secret: Secret = process.env.JWT_PRIVATE_KEY!
  // if it can find an id with the id in the token it will
  // use next() and the middleware will be complete, if not
  // it will use the catch function and thrown an error
  try {
    // decodes the token and verify if its right
    const decoded = jwt.verify(token, secret) as unknown as Decoded
    // searchs for a user with the id of the token
    req.user = await User.findById(decoded._id).select('-password')
    next()
  } catch (err) {
    res.status(401).json({
      ok: false,
      msg: 'Invalid token',
      result: err,
    })
  }
}
