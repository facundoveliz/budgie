import { Router } from 'express'
import auth from '../middleware/authMiddleware'
import {
  getUser,
  registerUser,
  loginUser,
  putUser,
  deleteUser,
} from '../controllers/userController'
import { catchErrors } from '../middleware/errorHandlerMiddleware'

const router: Router = Router()

router.get('/', auth, catchErrors(getUser))
router.post('/register', catchErrors(registerUser))
router.post('/login', catchErrors(loginUser))
router.put('/', auth, catchErrors(putUser))
router.delete('/', auth, catchErrors(deleteUser))

export default router
