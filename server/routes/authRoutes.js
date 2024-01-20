//ROUTE HANDLING FOR LOGIN ROUTES
//all routes handled here have base url of /login

//require and configure dotenv
require('dotenv').config();

//require express, jsonwebtoken, and bcrypt
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//require Pool from db
const pool = require('../database/db');

//load and store our JWT secret key
const secretKey = process.env.JWT_SECRET;

//initialize the express router
const router = express.Router();

//mock get request for login page
router.get('/', (req, res) => {
  res.send("Login Page");
})

//create post handler to handle authentication
router.post('/', async (req, res) => {
  //extract username and password from the request body
  const { username, password } = req.body; //assumes body will contain username and password

  // /*
  // OLD VERSION: Previously we didn't have a db set up, so we simulated that with an array
  // in our code and used the Array.find() method to find matching users. Now that we have 
  // a db setup, we no longer need any of this code. However, I am leaving it in for reference
  // in case anyone needs to look at it in the fututre. 
  
  // //  //create local storage array for users
  // // //in a real app, this would be replaced with a database
  // // let users = [
  // //   {id: 1, username: "codyfeldhaus", password: "password1"},
  // //   {id: 2, username: "johndoe", password: "password2"}
  // // ];
  // // //find a user in users array whose credentials match those sent in the request
  // // //Array.find() -> iterates through the array and runs each item through a function
  // // //that returns a boolean. If the function returns true, then find stops and returns
  // // //the item it was on
  // // const user = users.find(u => u.username === username && u.password === password);
  // */

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (rows.length > 0) {
      //store the user in a variable for easy access
      const user = rows[0];
      //use bcrypt to compare the submitted password with the stored hashed password
      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        //user is found, so create a JWT token
        //jwt.sign creates a new JWT with the specified payload and secret key
        const token = jwt.sign(
          {username: user.username}, //payload: contains user info, eg. username
          secretKey, //the secret key used for signing the token
          { expiresIn: '1h'} //sets token expiration time to 1 hour
        );
    
        //send the created token back in the response
        res.status(200).json({ token });
      } else {
        //could not validate user, so send back 401 unauthorized response
        res.status(401).json({
          'error': 'Unable to validate',
          'message': 'We were unable to validate you. Please check your credentials and try again later.'
        });
      }
    } else {
      res.status(401).json({
        'error': 'Invalid username',
        'message': 'Sorry, no such user exists in our database. Please try registering.'
      });
    }
  } catch (error) {
    res.status(401).json({
      'error': error.message,
      'message': 'We were unable to log you in. Please check your credentials and try again later.'
    })
  }
});

//export the auth router
module.exports = router;