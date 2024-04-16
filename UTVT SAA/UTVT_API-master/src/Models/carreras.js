// Importar Mongoose
const mongoose = require('mongoose');

// Definir el esquema de Carrera
const CarreraSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    clave: { type: String, required: true },
    // Asumo que idCarrera es un campo autoincremental en la base de datos, por lo que no es necesario definirlo aquí
});

// Definir el modelo Carrera a partir del esquema
const Carrera = mongoose.model('Carrera', CarreraSchema);

// Exportar el modelo Carrera para su uso en otras partes de la aplicación
module.exports = Carrera;
