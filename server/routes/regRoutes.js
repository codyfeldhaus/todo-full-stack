//ROUTE HANDLING FOR REGISTRATION ROUTES
//all routes handled here have a base url of /register

//require and configure dotenv
require('dotenv').config();

//require express and brcypt
const express = require('express');
const bcrypt = require('bcrypt');

//initialize the express router
const router = express.Router();

//require your pool from your db setup file
const pool = require('../database/db');

//create post handler to handle registration
router.post('/', async (req, res) => {
  //extract username and password from the request body
  const { username, email, password } = req.body; //assumes body will contain username and password

  //declare hashedPassword variable in scope of router.post because it is used in 
  //separate local scopes below (the try/catch for hashing the pw and the try/catch for trying to reg)
  let hashedPassword;

  //validate user input (for now, make sure none of the fields were empty)
  if (!username || !email || !password) {
    res.status(400).json({
      "error": "Bad request",
      "message": 'Please provide a value for each field: username, email, password'
    });
  }

  //check if username already exists
  try {
    //query db for rows that match username
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length > 0) {
      //if results are found for the query, the username is already in our db
      res.status(400).json({
          "error": "Duplicate User",
          "message": "Username already in use. Please choose another."
      });
    }
  } catch (error) {
    res.status(500).json({
      "error": error.message,
      "message": "A database error occurred. Please try again later."

    });
  }

  //check if email already exists
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      res.status(400).send('An account with this email address already exists. Please try logging in.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

  //generate a hashed password using the bcrypt module
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Error hashing password: ", error);
    res.status(500).send(error.message);
  }

  //insert the new user into the users table
  try {
    //query the database to insert into the users table
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//export the auth router
module.exports = router;