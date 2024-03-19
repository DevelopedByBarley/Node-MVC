const mongoose = require('mongoose');

function connection() {
  mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
      console.log('Database is connected successfully');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
}

module.exports = connection;
