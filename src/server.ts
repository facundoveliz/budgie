import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import routes from './routes'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(routes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))

mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log('MongoDB successfully connected...'))

// TODO: error handling
