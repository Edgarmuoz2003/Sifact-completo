const Factura = require('../models/factura');

const facturaCtrl = {};

facturaCtrl.createFactura = async (req, res) => {
  // Extraer los datos necesarios del cuerpo de la solicitud
  const {
    
    nombre,
    direccion,
    telefono,
    codigo,
    descripcion,
    precio,
    
    cantidad
  } = req.body;

  try {
    // Crear una nueva instancia del modelo Factura con los datos recibidos
    const nuevaFactura = new Factura({
      
      nombre,
      direccion,
      telefono,
      codigo,
      descripcion,
      precio,
     
      cantidad
    });

    // Guardar la nueva factura en la base de datos
    await nuevaFactura.save();

    // Enviar una respuesta de éxito al cliente
    res.status(201).json({ message: 'Factura creada exitosamente', factura: nuevaFactura });
  } catch (error) {
    // Manejar cualquier error ocurrido durante la creación o guardado de la factura
    console.error('Error al intentar guardar la factura:', error);
    res.status(500).json({ message: 'Error al intentar guardar la factura', error: error.message });
  }
};

module.exports = facturaCtrl;
