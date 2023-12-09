//ROUTE HANDLING FOR LOGIN ROUTES

//require and configure dotenv
require('dotenv').config();

//require express and jsonwebtoken
const express = require('express');
const jwt = require('jsonwebtoken');

//load and store our JWT secret key
const secretKey = process.env.JWT_SECRET;

//initialize the express router
const router = express.Router();

//create local storage array for users
//in a real app, this would be replaced with a database
let users = [
  {id: 1, username: "codyfeldhaus", password: "password1"},
  {id: 2, username: "johndoe", password: "password2"}
];

//all routes handled here have base url of /login

//mock get request for login page
router.get('/', (req, res) => {
  res.send("Login Page");
})

//create post handler to handle authentication
router.post('/', (req, res) => {
  //extract username and password from the request body
  const { username, password } = req.body; //assumes body will contain username and password

  //find a user in users array whose credentials match those sent in the request
  //Array.find() -> iterates through the array and runs each item through a function
  //that returns a boolean. If the function returns true, then find stops and returns
  //the item it was on
  const user = users.find(u => u.username === username && u.password === password);
  
  //check if a matching user was found
  if (user) {
    //user is found, so create a JWT token
    //jwt.sign creates a new JWT with the specified payload and secret key
    const token = jwt.sign(
      {userId: user.id}, //payload: contains user info, eg. user id
      secretKey, //the secret key used for signing the token
      { expiresIn: '1h'} //sets token expiration time to 1 hour
    );

    //send the created token back in the response
    res.json({ token });
  } else {
    //no user was found so send back 401 unauthorized response
    res.status(401).send("Authentication Failed");
  }

});

//export the auth router
module.exports = router;