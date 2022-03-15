import { Router } from 'express'

import user from './users'
import entries from './entries'

const router: Router = Router()

router.use('/api/users', user)
router.use('/api/entries', entries)

export default router
