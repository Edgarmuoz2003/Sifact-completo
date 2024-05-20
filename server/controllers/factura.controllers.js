const Factura = require('../models/factura');

const facturaCtrl = {};


facturaCtrl.createFactura = async (req, res) => {
  try {
    // Extraer datos de la solicitud (body, parámetros, etc.)
    const { numeroFactura, cliente, productos, totalFactura } = req.body;

    // Crear un nuevo objeto de factura utilizando el modelo
    const nuevaFactura = new Factura({
      numeroFactura,
      cliente,
      productos,
      totalFactura
    });

    // Guardar la nueva factura en la base de datos
    const facturaGuardada = await nuevaFactura.save();

    // Devolver una respuesta de éxito
    res.status(201).json({ mensaje: 'Factura guardada correctamente', factura: facturaGuardada });
  } catch (error) {
    // Manejar errores
    console.error('Error al guardar la factura:', error);
    res.status(500).json({ mensaje: 'Error al guardar la factura', error: error.message }); 
  }
};


// Obtener todas las facturas
facturaCtrl.getTodasLasFacturas = async (req, res) => {
  try {
    // Consultar todos los documentos de la colección 'Factura'
    const facturas = await Factura.find();

    // Verificar si se encontraron facturas
    if (!facturas || facturas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron facturas' });
    }

    // Devolver las facturas encontradas en la respuesta
    res.status(200).json({ facturas });
  } catch (error) {
    console.error('Error al obtener todas las facturas:', error);
    res.status(500).json({ mensaje: 'Error al obtener todas las facturas', error: error.message });
  }
};

// Obtener una factura por número de factura
facturaCtrl.getFacturaByNumero = async (req, res) => {
  try {
    const { numeroFactura } = req.params;
    
    // Convertir el número de factura a tipo número
    const numeroFacturaNumero = numeroFactura;

    // Buscar la factura por su número en la base de datos
    const facturaEncontrada = await Factura.findOne({ numeroFactura: numeroFacturaNumero });

    // Verificar si se encontró la factura
    if (!facturaEncontrada) {
      return res.status(404).json({ mensaje: `Factura con número ${numeroFactura} no encontrada` });
    }

    // Devolver la factura encontrada en la respuesta
    res.status(200).json({ factura: facturaEncontrada });
  } catch (error) {
    console.error('Error al buscar la factura por número:', error);
    res.status(500).json({ mensaje: 'Error al buscar la factura por número', error: error.message });
  }
};





module.exports = facturaCtrl;


