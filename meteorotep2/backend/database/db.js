const mysql = require('mysql2/promise');

const hostname = 'localhost';
const user = 'root';
const password = 'Passwd';
const database = 'meteorotep';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: hostname,
  user: user,
  password: password,
  database: database
});

// Conexión inicial para verificar y mostrar un mensaje de éxito
pool.getConnection()
  .then(connection => {
    console.log('Conexión exitosa al pool de conexiones MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar con el pool de conexiones:', err);
    throw err;
  });

module.exports = pool;
