const mongoose = require('mongoose');

// Definir el esquema de ApiKey
const apiKeySchema = new mongoose.Schema({
    apiKey: { type: String, required: true },
    empresa: { type: String, required: true },
    status: { type: Number, required: true }, // Cambiado a Number para representar un entero
    DateCreated: { type: Date, required: true }
});


// Crear el modelo ApiKey a partir del esquema
const apiKey = mongoose.model('apiKey', apiKeySchema, 'apiKey');
// Exportar el modelo ApiKey para su uso en otras partes de la aplicación
module.exports = apiKey;
