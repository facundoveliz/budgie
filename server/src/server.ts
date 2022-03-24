import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'

import routes from './routes'
import { errorHandler, notFound } from './middleware/errorHandlerMiddleware'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))
app.use(morgan('dev'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log('MongoDB successfully connected...'))

app.use(routes)

app.use(notFound)
app.use(errorHandler)
