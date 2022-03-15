import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from '../types/express'

interface Decoded {
  _id: string;
  iat: Date;
  exp: Date;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwtToken
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Access denied, no token provided',
    })
  }
  const secret: Secret = process.env.JWT_PRIVATE_KEY!
  const decoded = jwt.verify(token, secret) as unknown as Decoded
  next()
}
