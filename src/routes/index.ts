import { Router } from 'express'

import userRoutes from './userRoutes'
import entryRoutes from './entryRoutes'

const router: Router = Router()

router.use('/api/users', userRoutes)
router.use('/api/entries', entryRoutes)

export default router
