const express = require('express')
const users = require('../routes/users')
const entries = require('../routes/entries')

module.exports = function (app) {
  app.use(express.json())
  app.use('/api/users', users)
  app.use('/api/entries', entries)
}
