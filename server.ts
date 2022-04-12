import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

import routes from './routes'
import { errorHandler, notFound } from './middleware/errorHandlerMiddleware'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))
app.use(morgan('dev'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/.next'))
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../client/.next/server/pages/index.html'),
    )
  })
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}... and ${process.env.NODE_ENV}`))

mongoose
  .connect(
    (process.env.DATABASE_URI as string)
      || 'mongodb://127.0.0.1:27017/personal-budget',
  )
  .then(() => console.log('MongoDB successfully connected...'))

app.use(routes)

app.use(notFound)
app.use(errorHandler)
