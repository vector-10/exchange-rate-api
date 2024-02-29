const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const authRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute')
const currencyRoute = require('./routes/currencyRoute');

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// routes
app.use('/api/v1', authRoute);
// app.use('/api/v1', productRoute);
// app.use('/api/v1', currencyRoute);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  