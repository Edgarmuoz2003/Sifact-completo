const express = require('express');
const router = express.Router();
const facturaCtrl = require('../controllers/factura.controllers')

router.post('/facturacion', facturaCtrl.createFactura);
router.get('/facturacion', facturaCtrl.getTodasLasFacturas);
router.get('/facturacion/:numeroFactura', facturaCtrl.getFacturaByNumero);
//router.patch('/factura/:numeroFactura', facturaCtrl.updateFactura);
// router.delete('/factura/:id', facturaCtrl.deleteFactura);


module.exports = router;