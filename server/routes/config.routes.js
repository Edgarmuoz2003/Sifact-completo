const express = require('express');
const router = express.Router();
const configCtrl = require('../controllers/configuraciones.controllers');

//rutas empresa
router.get('/empresa', configCtrl.empresaConfig);
router.put('/empresa', configCtrl.updateDatos);

//rutas resolucion
router.get('/resolucion', configCtrl.datosDeLeyConfig);
router.put('/resolucion', configCtrl.updateResolucion)

//rutas mensajes
router.get('/mensajes', configCtrl.adicionalesConfig);
router.put('/mensajes', configCtrl.updateMensajes)



module.exports = router; 