// Importar Mongoose
const mongoose = require('mongoose');

// Definir el esquema de Alumno
const Alumno = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    matricula: { type: Number, required: true },
    Contraseña: { type: String, required: true },
    Telefono: { type: Number },
    correo: { type: String },
    cuatrimestre: { type: Number },
    grupo: { type: String },
    activa: { type: Boolean },
    token: { type: String },
    imagen: { type: String },
    ingresos: { type: mongoose.Types.Decimal128 },
    tipoCarrera: { type: String },
    deviceA_token: { type: String },
    deviceW_token: { type: String },
    idRol: { type: Number },
    idCarrera: { type: Number },
    matriculaTutor: { type: String },
    remember_token: { type: String },
    idHuella: { type: Number}
});

// Crear el modelo Alumno a partir del esquema
const alumnos = mongoose.model('alumnos', Alumno);

// Exportar el modelo Alumno para su uso en otras partes de la aplicación
module.exports = alumnos;
