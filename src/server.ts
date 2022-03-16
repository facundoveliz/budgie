import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import routes from './routes'
import { errorHandler, notFound } from './middleware/errorHandler'

const app = express()

dotenv.config()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log('MongoDB successfully connected...'))

app.use(routes)

app.use(notFound)
app.use(errorHandler)

// TODO: error handling
// TODO: improve comments on all project
