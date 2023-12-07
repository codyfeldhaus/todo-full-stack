//require express and CORS and jsonwebtoken
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

//require and configure dotenv
require('dotenv').config();

//load and store our JWT secret key
const secretKey = process.env.JWT_SECRET;

//create the express app
const app = express();

//set up middleware
//CORS middleware
app.use(cors());

//request logging middleware
app.use((req, res, next) => {
  //Examples: req.method: get, post, put, delete, req.url: /api/users
  console.log(`${req.method} request was sent to ${req.url}`);
  //next() is a function that we call to move on to the next middleware
  next();
})

//JSON parsing middleware
app.use(express.json());

//create local storage array for todos
let todos = [{id: 1, task: "wash dishes"}];

//create local storage array for users
let users = [
  {id: 1, username: "codyfeldhaus", password: "password1"},
  {id: 2, username: "johndoe", password: "password2"}
];

//HTTP Handers related to login
//mock get request for login page
app.get('/login', (req, res) => {
  res.send("Login Page");
})

//create post handler to handle authentication
app.post('/login', (req, res) => {
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

//HTTP Handlers related to todo data
//create a get handler to the path /todos that sends back the todos
app.get('/todos', (req, res) => {
  //sends back todos in JSON format
  res.json(todos);
})

//create a post handler to the path /todos that is used for adding a new todo
//to the todos array
//don't forget to create a new id for the todo
app.post('/todos', (req, res) => {
  //create new todo object from the request and store in a variable
  //be sure to add in an id
  const newTodo = { id: Date.now(), ...req.body }
  //add the new todo to the todos array
  todos.push(newTodo);
  //send back a 201 status code along with the new todo
  res.status(201).json(newTodo);
});

//define a port
const PORT = 3001;
//tell the app to listen at that port
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
})