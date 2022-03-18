import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongod = new MongoMemoryServer()

// connect to mock memory db.
export const connect = async () => {
  await mongoose.connect(process.env.DATABASE_URI as string)
}

// delete db collections
export const clearDatabase = async () => {
  const { collections } = mongoose.connection
  Object.keys(collections).forEach(async (key) => {
    const collection = collections[key]
    await collection.deleteMany({})
  })
}

// close db connection
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}
