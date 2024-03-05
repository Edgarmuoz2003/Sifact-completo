const Cliente = require('../models/cliente');
const clienteCtrl = {};

//Metodo para guardar clientes

clienteCtrl.createClientes = async(req, res) => {
    const { nit, nombre, direccion, telefono } = req.body;

    try {
        const cliente = new Cliente({
            nit,
            nombre,
            direccion,
            telefono
        });
    
        await cliente.save()
        res.send('El cliente a sido guardado') 
        
    } catch (error) {
        res.status(500).json({message: 'hubo un error al intentar guardar el cliente', details: error.message})
    }
}

//Metodo para consultar clientes
clienteCtrl.getUnCliente = async(req, res) => {
    const { nit } = req.params;

    try {
        const response = await Cliente.findOne({ nit: nit }).select('nit nombre direccion telefono _id');

        if(!response){
            return res.status(404).json({message: 'cliente no encontrado ' })
        }
        res.json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el cliente', details: error.message });
    }
}


//metodo para consultar todos los clientes
clienteCtrl.getClientes = async(req, res) => {
    try {
        const clientes = await Cliente.find({}, 'nit nombre direccion telefono _id' )
        res.json(clientes)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los registros', details: error.message });
    }
}

//Metodo para Actualizar Clientes
clienteCtrl.updateCliente = async(req, res) => {
    const { id } = req.params;

    const clienteEditado = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono
    }

    try {
        const clienteActualizado = await Cliente.findByIdAndUpdate(id, { $set: clienteEditado }, { new: true });

        if(!clienteActualizado){
            return res.status(404).json({ message: 'Cliente no encontrado ' })
        }
        res.send('El empleado a sido actualizado')
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al intentar actualizar el cliente', details: error.message });
    }
}

//Metodo  para eliminar clientes
clienteCtrl.deleteCliente = async(req, res) => {
    const { id } = req.params

    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(id);

        if(!clienteEliminado){
            return res.status(404).json({ message: 'No se a encontrado el cliente' })
        }
        res.send('El empleado a sido eliminado')
        
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al intentar eliminar el cliente', details: error.message });
    }
}




module.exports = clienteCtrl;
