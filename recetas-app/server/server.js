require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuración de la conexión a MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'recetas_db',
  connectionLimit: 5
});

// Verificar conexión a la base de datos
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1');
    console.log('Connected to the MariaDB database.');
    console.log('Test query successful:', rows);
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

// Función para generar un token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Rutas API
app.post('/api/register', async (req, res) => {
  let conn;
  try {
    const { username, email, password } = req.body;
    console.log('Registro de usuario:', { username, email, password });

    conn = await pool.getConnection();
    const existingUsers = await conn.query('SELECT * FROM User WHERE username = ? OR email = ?', [username, email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'El nombre de usuario o correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await conn.query('INSERT INTO User (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    console.log('Usuario registrado exitosamente:', { username, email });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    console.error('Error del servidor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    if (conn) conn.release();
  }
});

app.post('/api/login', async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    console.log('Attempting to log in with:', { email });

    conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM User WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, username: user.username, email: user.email },
      token: token
    });
  } catch (error) {
    console.error('Error del servidor:', error);
    res.status(500).json({ message: 'Error del servidor' });
  } finally {
    if (conn) conn.release();
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/auth.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/auth.html'));
});

app.get('/forum.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/forum.html'));
});

app.get('/search.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/search.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
});

app.listen(PORT, async () => {
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log(`Server is running on port ${PORT}`);
  } else {
    console.error('No se pudo iniciar el servidor debido a problemas con la base de datos');
    process.exit(1);
  }
});
