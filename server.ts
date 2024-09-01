import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import routes from './routes'
import { errorHandler, notFound } from './middleware/errorHandlerMiddleware'
import { metricsHandler, register } from './middleware/metricsHandlerMiddleware'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors({ credentials: true }))
app.use(metricsHandler);
app.use(routes)

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const port = process.env.SERVER_PORT
app.listen(port, () => console.log(`Listening on port ${port}...`))

mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log('MongoDB successfully connected...'))

app.use(notFound)
app.use(errorHandler)

