const express = require('express');
const router = express.Router();
const empleadoCtrl = require('../controllers/empleados.controlles');

router.post('/empleado', empleadoCtrl.createEmpleados);
router.get('/empleados', empleadoCtrl.getEmpleados);
router.get('/empleado/:documento', empleadoCtrl.getUnEmpleado);
router.patch('/empleado/:id', empleadoCtrl.actualizarEmpleado);
router.delete('/empleado/:id', empleadoCtrl.deleteEmpleado);



module.exports = router;