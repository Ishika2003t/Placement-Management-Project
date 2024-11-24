// backend.js

const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors());

// MySQL database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PHW#84#jeor',
  database: 'webtech'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
// Fetch all opportunities
app.get('/opportunities', (req, res) => {
  const query = 'SELECT * FROM opportunities';
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching opportunities:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json(results);
  });
});

// Add an opportunity
app.post('/opportunities', (req, res) => {
  const { title, company, description, deadline } = req.body;
  const query = `INSERT INTO opportunities (Title, Company, Description, Deadline) VALUES (?, ?, ?, ?)`;
  connection.query(query, [title, company, description, deadline], (err, results) => {
      if (err) {
          console.error('Error adding opportunity:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json({ message: 'Opportunity added successfully' });
  });
});

// Delete an opportunity
app.delete('/opportunities/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM opportunities WHERE Opportunity_ID = ?`;
  connection.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error deleting opportunity:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json({ message: 'Opportunity deleted successfully' });
  });
});

// Endpoint to create a new placement coordinator
app.post('/coordinators', (req, res) => {
  const { username, password } = req.body;

  // Query to insert a new coordinator
  const query = 'INSERT INTO coordinators (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (err, result) => {
      if (err) {
          console.error('Error creating coordinator:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }
      res.json({ success: true, message: 'Coordinator created successfully' });
  });
});

// Endpoint to get all placement coordinators
app.get('/coordinators', (req, res) => {
  // Query to fetch all coordinators
  const query = 'SELECT username FROM coordinators';
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching coordinators:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }
      res.json(results);
  });
});

// Endpoint to delete a coordinator
app.delete('/coordinators/:username', (req, res) => {
  const username = req.params.username;

  // Query to delete a coordinator
  const query = 'DELETE FROM coordinators WHERE username = ?';
  connection.query(query, [username], (err, result) => {
      if (err) {
          console.error('Error deleting coordinator:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }
      res.json({ success: true, message: 'Coordinator deleted successfully' });
  });
});

// Endpoint for user login
app.post('/login', (req, res) => {
  const { role, username, password } = req.body;

  // Map roles to corresponding database tables
  const roleTable = {
      student: 'students',
      admin: 'admins',
      coordinator: 'coordinators'
  };

  if (!roleTable[role]) {
      res.status(400).json({ success: false, error: 'Invalid role' });
      return;
  }

  // Query to check if the user exists with the provided credentials
  const query = `SELECT * FROM ${roleTable[role]} WHERE username = ? AND password = ?`;

  connection.query(query, [username, password], (err, results) => {
      if (err) {
          console.error('Error during login:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
      }

      if (results.length > 0) {
          // Successful login
          res.json({ success: true });
      } else {
          // Invalid credentials
          res.json({ success: false });
      }
  });
});


// Endpoint to fetch student data
app.get('/students', (req, res) => {
  // Query to fetch student data from the database
  const query = 'SELECT * FROM students';

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching student data from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    // Format the result as an array of student objects
    const students = results.map(student => ({
        studentID: student.Student_ID,
        name: student.Name,
        cgpa: student.CGPA,
        year: student.Year,
        email: student.Email,
        placementID: student.Placement_ID
    }));

    // Send the array of student data as JSON response
    res.json(students);
  });
});

app.post('/students', (req, res) => {
  const { studentID, name, cgpa, year, email, placementID, username, password } = req.body;

  // Validate input (basic example, can be extended)
  if (!studentID || !name || !cgpa || !year || !email || !placementID || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert the new student into the database (without hashing password)
  const query = `INSERT INTO students (Student_ID, Name, Year, CGPA, Email, Placement_ID, Username, Password) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [studentID, name, year, cgpa, email, placementID, username, password], 
    (err, result) => {
      if (err) {
        console.error('Error adding new student to the database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      // Send a success message as JSON response
      res.json({ message: 'Student added successfully' });
    });
});

// Endpoint to change the student's password
app.post('/change-password', (req, res) => {
  const { user, oldPassword, newPassword } = req.body;

  if (!user || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if the old password matches
  const query = 'SELECT * FROM students WHERE username = ?';
  connection.query(query, [user], (err, result) => {
      if (err) {
          console.error('Error fetching student data:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.length === 0) {
          return res.status(404).json({ error: 'Student not found' });
      }

      const student = result[0];
      // If passwords match, update to the new password
      if (student.password === oldPassword) {
          const updateQuery = 'UPDATE students SET Password = ? WHERE username = ?';
          connection.query(updateQuery, [newPassword, user], (updateErr, updateResult) => {
              if (updateErr) {
                  console.error('Error updating password:', updateErr);
                  return res.status(500).json({ error: 'Failed to update password' });
              }

              res.json({ message: 'Password updated successfully' });
          });
      } else {
          return res.status(400).json({ error: 'Old password is incorrect' });
      }
  });
});
    
// Endpoint to fetch all placement data
app.get('/placements', (req, res) => {
  // Query to fetch all placement data from the database
  const query = 'SELECT * FROM placements';

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching placement data from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    // Send the array of placement data as JSON response
    res.json(results);
  });
});

// Endpoint to fetch placement details for a specific student
app.get('/placements/:placementId', (req, res) => {
  const placementID = req.params.placementId;

  // Query to fetch placement details for the specified student ID from the database
  const query = 'SELECT * FROM placements WHERE Placement_ID = ?';

  // Execute the query with the specified student ID
  connection.query(query, [placementID], (err, results) => {
    if (err) {
      console.error('Error fetching placement data for student from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    // Send the array of placement data for the specified student ID as JSON response
    res.json(results);
  });
});


// Endpoint to delete a student
app.delete('/students/:studentID', (req, res) => {
  const studentID = req.params.studentID;
  console.log(`Trying to delete ${studentID}`);
  // Delete the student record from the database
  const query = `DELETE FROM students WHERE Student_ID = ?`;
  connection.query(query, [studentID], (err, result) => {
    if (err) {
      console.error('Error deleting student from the database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    // Send a success message as JSON response
    res.json({ message: 'Student deleted successfully' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
