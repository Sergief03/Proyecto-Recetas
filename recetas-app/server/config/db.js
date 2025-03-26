const mysql = require('mysql2'); // Use mysql2 for better compatibility with MariaDB

const connection = mysql.createConnection({
    host: 'localhost', // or the name of the container if using Docker networking
    user: 'root', // the user you set in the Docker run command
    password: 'root', // the password you set in the Docker run command
    database: 'recetas_db', // the database name you created
    port: 3306, // Specify the port for MariaDB

    connectTimeout: 20000 // Increase connection timeout to 20 seconds
});

const connectDB = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            return;
        }
        console.log('Connected to the MariaDB database.');
    });
};

// Add a query to test the connection
const testConnection = () => {
    connection.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Error during test query:', err);
        } else {
            console.log('Test query successful:', results);
        }
    });
};

module.exports = { connectDB, testConnection };
