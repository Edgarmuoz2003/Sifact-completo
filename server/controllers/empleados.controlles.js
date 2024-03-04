const Empleado = require('../models/empleado');
const bcrypt = require('bcrypt');
const empleadoCtrl = {};

//Metodo para crear empleados

empleadoCtrl.createEmpleados = async (req, res) => {
    //empiezo con un trycatch para dar manejo a los posibles errores
    try {
        //lo primero seria recuperar los datos enviados desde el formulario
        const { documento, nombre, contrasenia, cargo } = req.body;

        //ahora hasheamos la contraseña con bcript
        const hashedContrasenia = await bcrypt.hash(contrasenia, 10)

        //ahora si creamos una estancia del modelo Empleado y le pasamos los datos con la nueva contraseña hasheada
        const empleado = new Empleado({
            documento,
            nombre,
            contrasenia: String(hashedContrasenia),
            cargo
        });

        //por ultimo solo resta Guardar el empleado y enviar la respuesta

        await empleado.save();

        res.send("EL empleado a sido guardado con Exito");
        
    } catch (error) {
        res.status(500).json({ error: 'Error al crear empleado', details: error.message });
    }

}

//metodo para consultar los empleados registrados en la base de datos

empleadoCtrl.getEmpleados = async(req, res) => {
    const empleados = await Empleado.find({}, 'documento nombre cargo _id contrasenia');
    res.json(empleados)
}

//metodo para consultar un empleado especifico
//parque funcione el documento debe mandarse en la ruta, no como query parameter
empleadoCtrl.getUnEmpleado = async (req, res) => {
  const documento  = req.params.documento;
  
    try {
      const unEmpleado = await Empleado.findOne({ documento: documento }).select('documento nombre cargo _id');

      if(!unEmpleado){
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.json(unEmpleado);                                                                
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el empleado', details: error.message });
    }
  };

  //Metodo para actualizar un empledo
  //nota: este metodo actuliza y guarda los datos enviados una ves se modifiquen en pantalla. para cargar los datos en pantalla y modificarlos 
  //se deve crear una funcion desde el front 

  empleadoCtrl.actualizarEmpleado = async (req, res) => {
    try {
      const { id } = req.params;
      const empleadoEditado = {
        documento: req.body.documento,
        nombre: req.body.nombre,
        cargo: req.body.cargo
      };
  
      const empleadoActualizado = await Empleado.findByIdAndUpdate(id, { $set: empleadoEditado }, { new: true });
  
      if (!empleadoActualizado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }
      res.send('El Empleado a sido Actualizado')
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el empleado', details: error.message });
    }
  }; 

  //Metodo para eliminar empleado
  empleadoCtrl.deleteEmpleado = async (req, res) => {
    try {
      const { id } = req.params
      const empleado = await Empleado.findByIdAndDelete(id)

      if(!empleado) {
        return res.status(404).send('No se a encontrado el usuario')
      }

      res.send('El empleado a sido eliminado')
    } catch (error) {
      console.error(error)
      res.status(500).send('Ups!!! parece que algo a ocurrido con el Servidor, verifique e intente nuevamente')
    }
  }
  
  



module.exports = empleadoCtrl;