import { Router } from 'express'
import auth from '../middleware/auth'
import {
  getUsers, getUser, registerUser, loginUser,
} from '../controllers/users'

const router: Router = Router()

router.get('/', auth, getUsers)
router.get('/:id', auth, getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)

export default router
