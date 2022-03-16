import { Router } from 'express'
import auth from '../middleware/auth'
import {
  getUsers, getUser, registerUser, loginUser,
} from '../controllers/users'
import { catchErrors } from '../middleware/errorHandler'

const router: Router = Router()

router.get('/', auth, catchErrors(getUsers))
router.get('/:id', auth, catchErrors(getUser))
router.post('/register', catchErrors(registerUser))
router.post('/login', catchErrors(loginUser))

export default router
