const express = require('express');
const router = express.Router();
const clienteCtrl = require('../controllers/clientes.controllers');

router.post('/clientes', clienteCtrl.createClientes);
router.get('/cliente/:nit', clienteCtrl.getUnCliente); 
router.get('/clientes', clienteCtrl.getClientes);
router.patch('/clientes/:id', clienteCtrl.updateCliente);
router.delete('/clientes/:id', clienteCtrl.deleteCliente);


module.exports = router;