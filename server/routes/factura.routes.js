const express = require('express');
const router = express.Router();
const facturaCtrl = require('../controllers/factura.controllers')

router.post('/factura', facturaCtrl.createFactura);
// router.get('/factura/:descripcion', facturaCtrl.getFactura);
// router.patch('/factura/:id', facturaCtrl.updateFactura);
// router.delete('/factura/:id', facturaCtrl.deleteFactura);


module.exports = router;