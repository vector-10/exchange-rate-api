const Product = require('../models/productModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

const createProduct = catchAsyncErrors(async(req, res, next) => {
   try {
     // first we set the parameters needed to create product in req.body
     const { name, description, price, currency } = req.body;
    // Create a new product  in database
    const product = new Product({
        name,
        description,
        price,
        currency
      });
  
      // Save the new product to the database
      await product.save();
  
      // Send a success response
      res.status(201).json({ success: true, message: 'Product created successfully', product });
   } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ success: false, error: error.message });    
   }
})

const getAllProducts = catchAsyncErrors(async(req, res, next) => {
    try {
        // Retrieve all products from the database
        const products = await Product.find();
    
        // Send the list of products in the response
        res.json({ success: true, products });
      } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ success: false, error: error.message });
      }
})

const getOneProduct = catchAsyncErrors(async(req, res, next) => {
    try {
        // Extract product ID from the request parameters
        const { id } = req.params;
    
        // Find the product by ID in the database
        const product = await Product.findById(id);
    
        // If the product is not found, return a 404 error
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
    
        // Send the product details in the response
        res.json({ success: true, product });
      } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ success: false, error: error.message });
      } 
});


const updateProduct = catchAsyncErrors(async(req, res, next) => {
    try {
        // Extract product ID from the request parameters
        const { id } = req.params;
    
        // Extract updated product data from the request body
        const { name, description, price, currency } = req.body;
    
        // Find the product by ID in the database and update its fields
        const product = await Product.findByIdAndUpdate(id, { name, description, price, currency }, { new: true });
    
        // If the product is not found, return a 404 error
        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
    
        // Send a success response with the updated product details
        res.json({ success: true, message: 'Product updated successfully', product });
      } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ success: false, error: error.message });
      }

})

module.exports = {

}