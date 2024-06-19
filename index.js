const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');


const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'todo_app'  
});

const app = express();
app.use(bodyParser.json());

// Route to fetch tasks from the database
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) {
      console.error('Error fetching tasks: ' + err.stack);
      res.status(500).json({ error: 'Error fetching tasks' });
    } else {
      res.json(results);
    }
  });
});

// Route to add a new task
app.post('/tasks', (req, res) => {
  const { taskName } = req.body;
  if (!taskName) {
    res.status(400).json({ error: 'Task name is required' });
    return;
  }

  db.query('INSERT INTO tasks (task_name, completed) VALUES (?, ?)', [taskName, false], (err, result) => {
    if (err) {
      console.error('Error adding task: ' + err.stack);
      res.status(500).json({ error: 'Error adding task' });
    } else {
      res.json({ message: 'Task added successfully' });
    }
  });
});

// Route to delete a task
app.delete('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;

  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task: ' + err.stack);
      res.status(500).json({ error: 'Error deleting task' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
