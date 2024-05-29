const caja = require('../models/caja');
const Factura = require('../models/factura');
const registroCaja = require('../models/registroCierre');

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

//APERTURA Y CIERRE DE CAJA
facturaCtrl.abrirCaja = async (req, res) => {
  try {
    const  { fecha, base, abierto } = req.body 

    const datosCaja = new caja({
      fecha,
      base,
      abierto
    })

   await datosCaja.save()
   res.status(200).json({ message: 'se han guardado los datos de apertura correctamente' } )
  } catch (error) {
    res.status(500).json({ message: 'Error al abrir caja' })
  }
}

facturaCtrl.getAbrirCaja = async (req, res) =>{
  try {
    const response = await caja.find()
    const datosCaja =response[0]
    res.status(200).json({ datosCaja });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos de caja' })
  }
  }

  facturaCtrl.updateCaja = async (req, res)=>{
    const { id } = req.params

    const cajaEditada = {
      fecha: req.body.fecha,
      base: req.body.base,
      abierto: req.body.abierto,
      efectivo: req.body.efectivo,
      diferencia: req.body.diferencia
    }

    try {
      await caja.findByIdAndUpdate(id, { $set: cajaEditada }, { new: true })
      res.send('La caja a sido actualizada a Abierta')
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Error al intentar caja', details: error.message });
    }
  }

  facturaCtrl.saveRegistro = async (req, res) => {
    try {
      const { fecha, total_ventas, contado, diferencia } = req.body

    const nuevoRegistro = new registroCaja({
      fecha,
      total_ventas,
      contado,
      diferencia
    })
    await nuevoRegistro.save()
    res.status(200).json({ message: 'Se a guardado un Nuevo registro' } )
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Error al guardar el registro', details: error.message });
    }
    


  }

module.exports = facturaCtrl;


