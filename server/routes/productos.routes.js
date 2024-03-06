const express = require('express');
const router = express.Router();
const productosCtrl = require('../controllers/productos.controllers')

router.post('/productos', productosCtrl.createProductos);
router.get('/producto/:descripcion', productosCtrl.getProducto);
router.get('/productos', productosCtrl.getProductos);
router.patch('/productos/:id', productosCtrl.updateProductos);
router.delete('/productos/:id', productosCtrl.deleteProducto);


module.exports = router;