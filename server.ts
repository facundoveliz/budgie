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
app.use(express.static(path.join(__dirname, 'client/.next')))
app.use(routes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/.next/server/pages/index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

mongoose
  .connect(
    (process.env.DATABASE_URI as string)
      || 'mongodb://127.0.0.1:27017/personal-budget',
  )
  .then(() => console.log('MongoDB successfully connected...'))

app.use(notFound)
app.use(errorHandler)
