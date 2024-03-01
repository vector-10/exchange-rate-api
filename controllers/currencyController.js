const Currency = require('../models/currencyModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const axios = require('axios');


const getExchangeRates = catchAsyncErrors(async(req, res, next) => {
    try {
        const url = "https://v6.exchangerate-api.com/v6/69b31cee84c4ec139fa9b86f/latest/USD"
        // make API call to a currency converter
        const response = await axios.get(url);
        // Extract exchange rates from the response data
        const { rates } = response.data;
        // Send the exchange rates in the json response
    res.json({ success: true, rates });
    } catch (error) {
        return next(new ErrorHandler("Error converting currency", error, 500));
    }
});



const convertCurrency = catchAsyncErrors(async(req, res, next) => {
    try {
        //extract parameters from the request.query
        const { amount, fromCurrency, toCurrency } = req.query;

        //
        
    } catch (error) {
        


    }
})

















module.exports = {
    getExchangeRates,
    
}