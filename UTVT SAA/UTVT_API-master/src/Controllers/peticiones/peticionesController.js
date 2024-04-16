const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const Huellas = require('../../Models/huellas');
const Alumnos = require('../../Models/alumnos');
const { io } = require('../../../index');
const router = express.Router();
const WebSocket = require('ws');
const QR = require('../../Models/QR');
const apiKey = require("../../Models/apikey");

const wss = new WebSocket.Server({ port: 8080 });

/**
 * @swagger
 * /peticiones/scrape-images:
 *   get:
 *     summary: Raspar imágenes
 *     description: Extrae las URLs de las imágenes de un sitio web.
 *     responses:
 *       '200':
 *         description: Imágenes extraídas correctamente.
 *       '500':
 *         description: Error al extraer imágenes.
 */
router.get('/scrape-images', async (req, res) => {
    try {
        const url = 'https://utvt.edomex.gob.mx/';
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);
        const images = [];

        // Encuentra el carousel y extrae las URLs de las imágenes
        $('.views-element-container.block.block-views.block-views-blockslider-block-1 .views-field.views-field-field-imagen-slide .field-content img').each((index, element) => {
            const imageUrl = $(element).attr('src');
            images.push(imageUrl);
        });

        res.json(images);
    } catch (error) {
        console.error('Error al extraer imágenes:', error);
        res.status(500).json({ error: 'Error al extraer imágenes' });
    }
});

/**
 * @swagger
 * /peticiones/alumnos/huella:
 *   post:
 *     summary: Agregar huella de alumno
 *     description: Agrega la huella de un alumno identificado por su idHuella.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alumno'
 *     responses:
 *       '200':
 *         description: Éxito. La huella ha sido agregada correctamente.
 *       '400':
 *         description: Error en la solicitud. Verifique los parámetros enviados.
 *       '500':
 *         description: Error interno del servidor. Intente nuevamente más tarde.
 */
router.get('/alumnos/huella', async (req, res) => {
    const { idHuella } = req.query;
    console.log(req.query);
    //try {
    // Validar la ID de la huella
    if (!idHuella) {
        return res.status(400).json({ error: 'ID de huella no proporcionada' });
    }

    // Verificar si la huella ya existe en la base de datos
    const huellaExistente = await Huellas.findOne({ idHuella });

    if (huellaExistente) {
        console.log('La huella ya existe en la base de datos');

        // Buscar la información del alumno asociada a esta huella
        const alumno = await Alumnos.findOne({ idHuella });
        if (alumno) {
            // Emitir un evento de WebSocket cuando se encuentre la huella del alumno
            wss.clients.forEach(client => {
                client.send(JSON.stringify({ event: 'alumnoEncontrado', alumno }));
            });

            // Renderizar la plantilla de vista con la información del alumno
            return res.render('alumno', { alumno });
        }
    } else {
        // Almacenar la huella en la base de datos si no existe
        const nuevaHuella = new Huellas({ idHuella });
        await nuevaHuella.save();

        console.log('Huella agregada correctamente');

        // Emitir un evento de WebSocket cuando se agregue una nueva huella
        wss.clients.forEach(client => {
            client.send(JSON.stringify({ event: 'nuevaHuella', idHuella }));
        });

        return res.status(200).json({ huellaEncontrada: false, message: 'Huella agregada correctamente' });
    }
    // } catch (error) {
    //     console.error('Error al agregar o buscar huella:', error);
    //     return res.status(500).json({ error: 'Error interno del servidor' });
    // }
});

/**
 * @swagger
 * /peticiones/save/matricula/QR:
 *   post:
 *     summary: Guarda datos de matrícula en un código QR.
 *     description: Guarda los datos de matrícula en un código QR si la matrícula no existe previamente en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *                 description: Matrícula del alumno.
 *             required:
 *               - matricula
 *     responses:
 *       200:
 *         description: Datos guardados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nuevo dato guardado correctamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     matricula:
 *                       type: string
 *                       example: ABC123
 *       400:
 *         description: Error al intentar guardar los datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al guardar el nuevo dato: [mensaje de error]"
 */



router.post('/save/matricula/QR', async (req,res) =>{
    const matricula = req.body.matricula;

    const validateMatricula = await Alumnos.findOne({matricula: matricula});
    if(validateMatricula){
        const NuevoQR = new QR({
            matriculaAlumno: matricula
        })

        NuevoQR.save().then(resultado => {
            console.log('Nuevo dato guardado correctamente',resultado);
            res.status(200).json({
                message: 'Nuevo dato guardado correctamente',
                data: resultado
            });
        })
        .catch(error=>{
            console.error('Error al guardar el nuevo dato:', error);
            res.status(400).json({
                error: 'Error al guardar el nuevo dato: ' + error.message
            });
        })
    }
})

router.get('/huellas', async (req, res) => {
    const apiKey = req.query.token;

    try {
        // Consultar la base de datos para verificar si existe un registro que coincida con ese token y el status sea igual a 1
        const tokenExists = await verifyTokenInDatabase(apiKey);

        if (tokenExists) {
            // Si el token existe en la base de datos, ejecutar el código para obtener los Huellas
            Huellas.find({}).lean().exec()  // Ejecuta la consulta y devuelve una promesa
                .then(Huellas => {
                    //console.log('Huellas encontrados:', Huellas);
                    res.status(200).json(Huellas); // Envía la respuesta JSON al cliente
                })
                .catch(err => {
                    //console.error('Error al buscar en la colección de Huellas:', err);
                    res.status(500).json({ error: 'Error al buscar en la colección de Huellas.' });
                });
        } else {
            // Si el token no existe en la base de datos, devolver un error
            res.status(401).json({ error: 'Token no válido' });
        }
    } catch (err) {
        //console.error('Error al obtener Huellas:', err);
        res.status(500).json({ error: 'Error al obtener Huellas.' });
    }
});

router.post('/save/asignacionhuella', async (req, res) => {
    try {
        const { apikey, idHuella, matricula } = req.body;
        console.log(matricula)
        const tokenExists = await verifyTokenInDatabase(apikey);
        if (tokenExists) {
            // Verificar si el alumno existe
            const alumno = await Alumnos.findOne({ matricula: matricula });
            // console.log(alumno)
            if (alumno) {
                // Actualizar la asignación de huella
                const updatedAlumno = await Alumnos.findOneAndUpdate(
                    { matricula: matricula },
                    { idHuella: idHuella },
                    { new: true }
                );
                if (updatedAlumno) {
                    res.status(200).json({ message: 'Asignación de huella actualizada correctamente.' });
                } else {
                    res.status(500).json({ error: 'Error al actualizar la asignación de huella.' });
                }
            } else {
                res.status(404).json({ error: 'Alumno no encontrado.' });
            }
        } else {
            res.status(401).json({ error: 'Token inválido.' });
        }
    } catch (error) {
        console.error('Error en la asignación de huella:', error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});


// Función para verificar si un token existe en la base de datos y su status es igual a 1
async function verifyTokenInDatabase(key) {
    try {
        // Realizar la consulta en la base de datos para verificar si el token existe y su status es igual a 1
        const token = await apiKey.findOne({ apiKey: key });
        if (token === null) {
            return false; // Token no encontrado
        } else if (token.status === 1) {
            return true; // Token encontrado y su status es igual a 1
        } else if (token.status === 2) {
            return null; // Token encontrado pero su status es igual a 2
        }
    } catch (error) {
        console.error('Error al verificar el token en la base de datos:', error);
        throw error;
    }
}



router.post('/alumno/token/notification/save', async (req, res) => {
    try {
        const { matricula, token } = req.body; // Suponiendo que desde React envías userId y token

        // Buscar al alumno por userId
        const alumno = await Alumnos.findOne({ matricula: matricula });
        if (!alumno) {
            return res.status(404).json({ message: 'Alumno not found' });
        }

        const alumnoUpdate = await Alumnos.updateOne({ matricula: matricula }, { deviceA_token: token });

        res.status(200).json({ message: 'Token saved successfully' });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
