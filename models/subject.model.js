const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
