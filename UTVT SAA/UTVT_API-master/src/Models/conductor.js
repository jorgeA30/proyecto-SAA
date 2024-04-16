const mongoose = require('mongoose');

// Definición del esquema del conductor de autobús
const conductorAutobusSchema = new mongoose.Schema({
    matricula: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    licencia: {
        type: String,
        required: true
    },
    ruta: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    idRol: {
        type: Number,
        required: true
    },
    remember_token: {
        type: String
    },
    imagen: {
        type: String
    },
    activa: {
        type: Boolean,
        default: true
    }
    // Otros campos que puedan ser relevantes para tu aplicación
}, { timestamps: true });

// Creación del modelo para conductores de autobús
const ConductorAutobus = mongoose.model('ConductorAutobus', conductorAutobusSchema);

module.exports = ConductorAutobus;
