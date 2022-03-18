import { Router } from 'express'
import auth from '../middleware/authMiddleware'
import {
  getUser, registerUser, loginUser,
} from '../controllers/userController'
import { catchErrors } from '../middleware/errorHandlerMiddleware'

const router: Router = Router()

router.get('/', auth, catchErrors(getUser))
router.post('/register', catchErrors(registerUser))
router.post('/login', catchErrors(loginUser))

export default router
