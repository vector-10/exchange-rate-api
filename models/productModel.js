const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // attributes for the product model
    name: {
        type: String,
        required: [true, "Please provide a name for the product"]
      },
      description: {
        type: String,
        required: [true, "Please provide a product description"]
      },
      price: {
        type: Number,
        required: [true, "Please provide a selling price for the product"]
      },
      currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency' // Reference to the Currency model
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

})


module.exports = mongoose.model("Product", productSchema);