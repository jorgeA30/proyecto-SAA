const mongoose = require('mongoose');
const winston = require('winston');

// Configura el logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  ),
  transports: [
      new winston.transports.File({ filename: 'logs/database.log' }) // Archivo de registro para las consultas a la base de datos
  ]
});
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Manejo de eventos de conexión y error
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Error al conectar a MongoDB:', error);
});
// db.once('open', () => {
//   console.log('Conexión exitosa a MongoDB.');
// });

// Exportar la instancia de conexión a MongoDB para su uso en otras partes del código si es necesario
module.exports = db;
