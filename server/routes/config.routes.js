const express = require('express');
const router = express.Router();
const configCtrl = require('../controllers/configuraciones.controllers');

//rutas empresa
router.get('/empresa', configCtrl.empresaConfig);
router.put('/empresa', configCtrl.updateDatos);

//rutas resolucion
router.get('/resolucion', configCtrl.datosDeLeyConfig);
router.post('/resolucion', configCtrl.createDatosLey);
router.put('/resolucion/:id', configCtrl.updateMensajesLey);

//rutas mensajes
router.get('/mensajes', configCtrl.adicionalesConfig);
router.put('/mensajes', configCtrl.updateMensajes)

//rutas config
router.post('/numActual', configCtrl.saveNumActual);
router.get('/numActual', configCtrl.getNumActual);
router.put('/numActual/:id', configCtrl.updateNumActual);



module.exports = router; 