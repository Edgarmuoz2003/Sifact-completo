const express = require('express');
const router = express.Router();
const facturaCtrl = require('../controllers/factura.controllers')

router.post('/facturacion', facturaCtrl.createFactura);
router.get('/facturacion', facturaCtrl.getTodasLasFacturas);
router.get('/facturacion/:numeroFactura', facturaCtrl.getFacturaByNumero);
router.post('/caja', facturaCtrl.abrirCaja);
router.patch('/caja/:id', facturaCtrl.updateCaja);
router.get('/caja', facturaCtrl.getAbrirCaja);
router.post('/registro', facturaCtrl.saveRegistro);


//router.patch('/factura/:numeroFactura', facturaCtrl.updateFactura);
// router.delete('/factura/:id', facturaCtrl.deleteFactura);


module.exports = router;