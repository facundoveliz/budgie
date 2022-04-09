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
  app.use(express.static('dist/client/.next'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', '.next', 'index.html'))
  })
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log('MongoDB successfully connected...'))

app.use(routes)

app.use(notFound)
app.use(errorHandler)
