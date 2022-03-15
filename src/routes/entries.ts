import { Router } from 'express'
import auth from '../middleware/auth'
import {
  getEntries, postEntry, putEntry, deleteEntry,
} from '../controllers/entries'

const router: Router = Router()

router.get('/', auth, getEntries)
router.post('/', auth, postEntry)
router.put('/:id', auth, putEntry)
router.delete('/:id', auth, deleteEntry)

export default router
