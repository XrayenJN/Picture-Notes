const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const detailSchema = new Schema({
  username: {type: String, required: true},
  subject: {type: String, required: true},
  description: {type: String, required: true},
  date: {type: Date, required: true},
  image: {type: String}
}, {
  timestamps: true,
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;