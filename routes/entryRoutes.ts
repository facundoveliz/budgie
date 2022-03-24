import { Router } from 'express'
import auth from '../middleware/authMiddleware'
import {
  getEntries, postEntry, putEntry, deleteEntry,
} from '../controllers/entryController'
import { catchErrors } from '../middleware/errorHandlerMiddleware'

const router: Router = Router()

router.get('/', auth, catchErrors(getEntries))
router.post('/', auth, catchErrors(postEntry))
router.put('/:id', auth, catchErrors(putEntry))
router.delete('/:id', auth, catchErrors(deleteEntry))

export default router
