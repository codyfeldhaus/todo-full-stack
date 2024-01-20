//route handling for all routes dealing directly with the todos
//require express
const express = require('express');

const { Pool } = require('pg');

//initialize an express router
const router = express.Router();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo_full_stack',
  password: process.env.DB_PASSWORD,
  port: 5433
})

//HTTP Handlers related to todo data
//create a get handler to the path /todos that sends back the todos
//leave out the initial /todos as it is already inferred
//ie, if we did '/todos' here as well, then that would mean 
//the actual route being handled is '/todos/todos'
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM todos');
  //sends back todos in JSON format
  res.json(rows);
  // console.log(rows[0].reg_time)
  // const time = new Date(rows[0].reg_time);
  // console.log(time.getMinutes());
})

//create a post handler that is used for adding a new task to the todos table
//don't forget to create a new id for the todo
router.post('/', async (req, res) => {
  //extract data from the body of the request
  const { user_id, task } = req.body;

  try {
    //try inserting the new task into the todos table
    await pool.query('INSERT INTO todos (user_id, task) VALUES ($1, $2)', [user_id, task]);
    //if successful, send success message
    res.status(201).json({
      "message": "Task added successfully"
    })
  } catch (error) {
    //if there's an error, send back an error message
    res.status(500).json({
      "error": error.message,
      "message": "Adding task was unsuccessful, please try again."
    })
  }
});


//exporting the router to be used in main file
module.exports = router;