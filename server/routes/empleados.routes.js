const express = require('express');
const router = express.Router();
const empleadoCtrl = require('../controllers/empleados.controlles');

router.post('/empleado', empleadoCtrl.createEmpleados);
router.get('/empleado', empleadoCtrl.getEmpleados);
router.get('/empleado/:id', empleadoCtrl.getUnEmpleado);
router.patch('/empleado/:id', empleadoCtrl.actualizarEmpleado);



module.exports = router;