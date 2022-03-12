const express = require('express');
const cookieParser = require('cookie-parser');
const users = require('./users');
const entries = require('./entries');

module.exports = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/users', users);
  app.use('/api/entries', entries);
};
