const mongoose = require('mongoose')

module.exports = function () {
  mongoose
    .connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB successfully connected'))
}
