// Create the API using Node.js and Express.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'study_cafe_finder'
});

// Connect to the database
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database: ' + error.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

// Parse JSON requests
app.use(express.json());

// Create an endpoint to get all cafes
app.get('/cafes', (req, res) => {
    // Get the query parameters
    const city = req.query.city;
    const preferences = req.query.preferences;

    // Build the SQL query
    let sql = 'SELECT * FROM cafes';
    let params = [];

    // Add the city filter if provided
    if (city) {
        sql += ' WHERE city = ?';
        params.push(city);
    }

    // Add the preferences filter if provided
    if (preferences) {
        // Split the preferences by comma
        const preferences = preferences.split(',');

        // Check if the preferences are valid
        const validpreferences = ['quiet', 'cozy', 'lively', 'wifi', 'power', 'food'];
        for (let pref of preferences) {
            if (!validpreferences.includes(preferences)) {
                // Return an error if an invalid preference is given
                return res.status(400).json({ error: 'Invalid preference: ' + pref });
            }
        }

        // Add the preferences to the SQL query
        sql += city ? ' AND (' : ' WHERE (';
        for (let i = 0; i < preferences.length; i++) {
            sql += i > 0 ? ' OR ' : '';
            sql += preferences[i] + ' = ?';
            params.push(true);
        }
        sql += ')';
    }

    // Execute the SQL query
    connection.query(sql, params, (error, results) => {
        if (error) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error querying the database: ' + error });
        }
        // Return the results as JSON
        res.json(results);
    });
});

// Create an endpoint to get a specific cafe by id
app.get('/cafes/:id', (req, res) => {
    // Get the cafe id from the URL parameter
    const id = req.params.id;

    // Build the SQL query
    const sql = 'SELECT * FROM cafes WHERE id = ?';
    const params = [id];

    // Execute the SQL query
    connection.query(sql, params, (error, results) => {
        if (error) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error querying the database: ' + error });
        }
        // Check if the cafe exists
        if (results.length > 0) {
            // Return the cafe as JSON
            res.json(results[0]);
        } else {
            // Return a 404 error if the cafe does not exist
            res.status(404).json({ error: 'Cafe not found' });
        }
    });
});

// Create an endpoint to create a new cafe
app.post('/cafes', (req, res) => {
    // Get the cafe data from the request body
    const cafe = req.body;

    // Validate the cafe data
    if (!cafe.name || !cafe.address || !cafe.city || !cafe.rating || !cafe.image) {
        // Return a 400 error if some data is missing
        return res.status(400).json({ error: 'Missing cafe data' });
    }

    // Build the SQL query
    const sql = 'INSERT INTO cafes (name, address, city, rating, wifi, power, food, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [cafe.name, cafe.address, cafe.city, cafe.rating, cafe.wifi, cafe.power, cafe.food, cafe.image];

    // Execute the SQL query
    connection.query(sql, params, (error, results) => {
        if (error) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error inserting into the database: ' + error });
        }
        // Return the created cafe as JSON
        res.json({
            id: results.insertId,
            ...cafe
        });
    });
});

// Create an endpoint to get all users
app.get('/users', (req, res) => {
    // Build the SQL query
    const sql = 'SELECT * FROM users';

    // Execute the SQL query
    connection.query(sql, (error, results) => {
        if (error) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error querying the database: ' + error });
        }
        // Return the results as JSON
        res.json(results);
    });
});

// Create an endpoint to get a specific user by id
app.get('/users/:id', (req, res) => {
    // Get the user id from the URL parameter
    const id = req.params.id;

    // Build the SQL query
    const sql = 'SELECT * FROM users WHERE id = ?';
    const params = [id];

    // Execute the SQL query
    connection.query(sql, params, (err, results) => {
        if (err) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error querying the database: ' + err });
        }
        // Check if the user exists
        if (results.length > 0) {
            // Return the user as JSON
            res.json(results[0]);
        } else {
            // Return a 404 error if the user does not exist
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Create an endpoint to create a new user
app.post('/users', (req, res) => {
    // Get the user data from the request body
    const user = req.body;

    // Validate the user data
    if (!user.username || !user.password || !user.email) {
        // Return a 400 error if some data is missing
        return res.status(400).json({ error: 'Missing user data' });
    }

    // Build the SQL query
    const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    const params = [user.username, user.password, user.email];

    // Execute the SQL query
    connection.query(sql, params, (err, results) => {
        if (err) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error inserting into the database: ' + err });
        }
        // Return the created user as JSON
        res.json({
            id: results.insertId,
            ...user
        });
    });
});

// Create an endpoint to get the favorites of a user
app.get('/users/:id/favorites', (req, res) => {
    // Get the user id from the URL parameter
    const id = req.params.id;

    // Build the SQL query
    const sql = 'SELECT cafes.* FROM cafes JOIN favorites ON cafes.id = favorites.cafe_id WHERE favorites.user_id = ?';
    const params = [id];

    // Execute the SQL query
    connection.query(sql, params, (err, results) => {
        if (err) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error querying the database: ' + err });
        }
        // Return the results as JSON
        res.json(results);
    });
});

// Create an endpoint to add a favorite for a user
app.post('/users/:id/favorites', (req, res) => {
    // Get the user id from the URL parameter
    const user_id = req.params.id;

    // Get the cafe id from the request body
    const cafe_id = req.body.cafe_id;

    // Validate the cafe id
    if (!cafe_id) {
        // Return a 400 error if the cafe id is missing
        return res.status(400).json({ error: 'Missing cafe id' });
    }

    // Build the SQL query
    const sql = 'INSERT INTO favorites (user_id, cafe_id) VALUES (?, ?)';
    const params = [user_id, cafe_id];

    // Execute the SQL query
    connection.query(sql, params, (err, results) => {
        if (err) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error inserting into the database: ' + err });
        }
        // Return a success message as JSON
        res.json({ message: 'Favorite added successfully' });
    });
});

// Create an endpoint to delete a favorite for a user
app.delete('/users/:id/favorites', (req, res) => {
    // Get the user id from the URL parameter
    const user_id = req.params.id;

    // Get the cafe id from the request body
    const cafe_id = req.body.cafe_id;

    // Validate the cafe id
    if (!cafe_id) {
        // Return a 400 error if the cafe id is missing
        return res.status(400).json({ error: 'Missing cafe id' });
    }

    // Build the SQL query
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND cafe_id = ?';
    const params = [user_id, cafe_id];

    // Execute the SQL query
    connection.query(sql, params, (error, results) => {
        if (error) {
            // Return an error if the query fails
            return res.status(500).json({ error: 'Error deleting from the database: ' + error });
        }
        // Return a success message as JSON
        res.json({ message: 'Favorite deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});


