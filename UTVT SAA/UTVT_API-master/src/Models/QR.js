//GUARDAR MATRICULA-ALUMNO,
// Importar Mongoose
const mongoose = require('mongoose');

// Definir el esquema de Alumno
const QRSchema  = new mongoose.Schema({
    matriculaAlumno: { type: Number },
}, { timestamps: true });

// Crear el modelo Alumno a partir del esquema
const QR = mongoose.model('QR', QRSchema);

// Exportar el modelo Alumno para su uso en otras partes de la aplicación
module.exports = QR;
