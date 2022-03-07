const mongoose = require('mongoose');

module.exports.checkIdValid = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
