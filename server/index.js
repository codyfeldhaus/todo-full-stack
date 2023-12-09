//require and configure dotenv
require('dotenv').config();

//require express, CORS, and jsonwebtoken
const express = require('express');
const cors = require('cors');

//require middleware
const authMiddleware = require('./middleware/authMiddleware');
const reqLogMiddleware = require('./middleware/reqLogMiddleware');

//require routes
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

//create the express app
const app = express();

//set up middleware
//CORS middleware
app.use(cors());

//JSON parsing middleware
app.use(express.json());

//request logging middleware
app.use(reqLogMiddleware);

//connect the login route handlers
app.use('/login', authRoutes);

//protect route with authMiddleware by applying it to the /todos route
//request passes through the authMiddleware, and if authentication succeeds,
//authMiddleware then allows the request to continue to the appropriate handler
//it auth fails, authMiddleware sends the response with an error status message
//and the request/response chain stops there
app.use('/todos', authMiddleware, todoRoutes); //now routes are in separate file

//define a port
const PORT = 3001;
//tell the app to listen at that port
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})