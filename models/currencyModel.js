const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

})


module.exports = mongoose.model("Currency", currencySchema);