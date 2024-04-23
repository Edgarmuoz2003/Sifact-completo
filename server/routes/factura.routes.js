const express = require('express');
const router = express.Router();
const facturaCtrl = require('../controllers/factura.controllers')

router.post('/factura', facturaCtrl.createFactura);
router.get('/factura', facturaCtrl.getTodasLasFacturas);
router.get('/factura/:numeroFactura', facturaCtrl.getFacturaByNumero);
//router.patch('/factura/:numeroFactura', facturaCtrl.updateFactura);
// router.delete('/factura/:id', facturaCtrl.deleteFactura);


module.exports = router;