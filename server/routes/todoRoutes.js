//route handling for all routes dealing directly with the todos
//require express
const express = require('express');

//initialize an express router
const router = express.Router();

//create local storage array for todos
//in a "real" app, would be replaced with a database
//eg: might still want a todos array, but will create
//it by querying your database
let todos = [{id: 1, task: "wash dishes"}];

//HTTP Handlers related to todo data
//create a get handler to the path /todos that sends back the todos
//leave out the initial /todos as it is already inferred
//ie, if we did '/todos' here as well, then that would mean 
//the actual route being handled is '/todos/todos'
router.get('/', (req, res) => {
  //sends back todos in JSON format
  res.json(todos);
})

//create a post handler that is used for adding a new todo to the todos array
//don't forget to create a new id for the todo
router.post('/', (req, res) => {
  //create new todo object from the request and store in a variable
  //be sure to add in an id
  const newTodo = { id: Date.now(), ...req.body }
  //add the new todo to the todos array
  todos.push(newTodo);
  //send back a 201 status code along with the new todo
  res.status(201).json(newTodo);
});

//this will handle requests to the path /todos/test
// router.get('/test', (req, res) => {
//   res.send("This is a test");
// })

//exporting the router to be used in main file
module.exports = router;