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
      res.status(201).json({ message: 'Product created successfully', product });
   } catch (error) {
        // Send an error response if something goes wrong
        return next(new ErrorHandler("Product not successfully created", 500))   
   }
})

const getAllProducts = catchAsyncErrors(async(req, res, next) => {
    try {
        // Retrieve all products from the database
        const products = await Product.find();
    
        // Send the list of products in the json response
        res.json({ success: true, products });
      } catch (error) {
        // Send an error response if something goes wrong
        return next(new ErrorHandler("Products not successfully found", 500))
      }
})

const getOneProduct = catchAsyncErrors(async(req, res, next) => {
    try {
        // Extract product ID from the request parameters
        const  productId  = req.params.productId;    
        // Find the product by ID in the database
        const product = await Product.findById(productId);    
        // If the product is not found, return a 404 error
        if (!product) {
          return next(new ErrorHandler(`User with ID ${userId} does not exist on database`));
        }    
        // Send the product details in the response
        res.status(200).json({
          message: "Product successfully found",
          product
        })
      } catch (error) {
        // Send an error response if something goes wrong
        return next(new ErrorHandler("Product not successfully found", 500))
      } 
});


const updateProduct = catchAsyncErrors(async(req, res, next) => {
    try { 
         // Extract product ID from the request parameters
         const productId = req.params.productId;    
        // Find the product by ID in the database and update its fields
        const product = await Product.findById(productId);    
        // If the product is not found, return a 404 error
        if (!product) {
          return next(new ErrorHandler(`Product with ID ${productId} not found to be updated`, 401))
        }    
        //update product based on the fields to be changed
        product.name = req.body.name || product.name;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;
        product.currency = req.body.currency || product.currency;

        // save the updated product 
        await product.save();
        // Send a success response with the updated product details
        res.status(200).json({ 
          message: 'Product updated successfully',
          product: {
            _id: product._id,
            name: product.name,
            currency: product.currency,
            description: product.description,
          }
        });
      } catch (error) {
        // Send an error response if something goes wrong
        return next(new ErrorHandler("Product not successfully product", 500))
      }

})

module.exports = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct
}