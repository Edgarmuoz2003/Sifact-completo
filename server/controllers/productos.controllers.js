const Producto = require('../models/producto');
const productoCtrl = {};

//metodo para crear nuevos productos
productoCtrl.createProductos = async(req, res) => {
    const { codigo, descripcion, precio, impuesto, stock } = req.body

    try {
        const producto = new Producto({
            codigo,
            descripcion,
            precio,
            impuesto,
            stock
        })

        await producto.save()
        res.send('El producto a sido creado')
    } catch (error) {
        res.status(500).json({message: 'hubo un error al intentar guardar el producto', details: error.message})
    }
}

//metodo para consultar productos 
productoCtrl.getProducto = async (req, res) => {
    const codigo = req.params.codigo;

    try {
        const expresion = new RegExp(codigo, 'i');
        const response = await Producto.findOne({ codigo: expresion });

        if (!response) {
            return res.status(404).json({ message: 'No se encontró ningún producto con esa descripción' });
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
}



//metodo para consultar todos los productos
productoCtrl.getProductos = async(req, res) => {
    try {
        const productos = await Producto.find({})
        res.json(productos)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros', details: error.message });
    }
}

//metodo para actualizar productos
productoCtrl.updateProductos = async(req, res) => {
    const { id } = req.params

    const productoEditado = {
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        impuesto: req.body.impuesto,
        stock: req.body.stock
    }

    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, { $set: productoEditado }, { new:true });

        if(!productoActualizado){
            return res.status(404).json({ message: 'producto no encontrado' })
        }
        res.send('EL producto a sido actualizado')
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al intentar actualizar el producto', details: error.message });
    }
}

//Metodo para eliminar un producto
productoCtrl.deleteProducto = async(req, res) => {
    const { id } = req.params

    try {
        productoEliminado = await Producto.findByIdAndDelete(id);

        if(!productoEliminado){
            return res.status(404).json({ message: 'NO se ha encontrado el producto' })
        }
        res.send('El producto a sido Elminado')
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al intentar eliminar el producto', details: error.message });
    }
}




module.exports = productoCtrl; 