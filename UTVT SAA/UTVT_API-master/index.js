require('dotenv').config();

const express = require("express");
const app = express();
// const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const { swaggerUi, specs } = require('./swagger');
const logger = require('./logger'); // Importa el módulo de registro
const sequelize = require('./src/config/db');
const cors = require('cors');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
//Controllers
const alumnosController = require('./src/Controllers/alumnosController');
const authController = require('./src/Controllers/Auth/authController');
const peticionesController = require('./src/Controllers/peticiones/peticionesController');

// Configurar las vistas
app.set('views', path.join(__dirname, 'public', 'views', 'alumnos'));
app.set('view engine', 'ejs'); // Esto configura EJS como motor de plantillas// Esto configura EJS como motor de plantillas

// Middleware
app.use(express.json());

app.use(cors()); // Esto permite todas las solicitudes CORS, también puedes especificar opciones para permitir solo ciertos orígenes.

// Rutas
app.use('/api', alumnosController);
app.use('/api/auth', authController);
app.use('/api/peticiones', peticionesController);
// Ruta para Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Ruta de bienvenida
app.get("/", (req, res) => {
    // Enviar el archivo HTML de la página de inicio
    res.sendFile(__dirname + '/public/index.html');
});

app.get("/huella", (req, res) => {
    // Enviar el archivo HTML de la página de inicio
    res.sendFile(__dirname + '/public/login.html');
});

app.get("/cuervobus", (req, res) => {
    // Enviar el archivo HTML de la página de inicio
    res.sendFile(__dirname + '/public/cuervobus.html');
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

const DirectorioImagenes = path.join(__dirname, 'assets', 'uploads');
const Directorioqr = path.join(__dirname, 'assets', 'QRs');
app.use('/imagenes', express.static(DirectorioImagenes));
app.use('/qr', express.static(Directorioqr));

// Iniciar el servidor
// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });

app.listen(process.env.PORT);