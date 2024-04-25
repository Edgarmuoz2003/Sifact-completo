let Empresa = require('../config/empresa.json');
let Resolucion = require('../config/mensajesDeLey.json');
let Mensajes = require('../config/mensajesAdicionales.json')
const fs = require('fs');
const path = require('path');
const configCtrl = {};
const MensajesLey = require('../models/mensajesLey');
const Config = require('../models/config')

//METODOS PARA LA VISTA EMPRESA

//metodo para enviar al front los datos de la empresa.json
configCtrl.empresaConfig = (req, res) => {
    try {
        res.json(Empresa)
    } catch (error) {
        res.status(500).json({message: 'hubo un error al intentar Obtener los datos', details: error.message})
    }
    
};

//metodo para actualizar empresa.json
configCtrl.updateDatos = (req, res) => {
    try {
        const empresaEditada = {
            nit: req.body.nit,
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            telefono: req.body.telefono
        };

        // Actualizar la variable local
        Empresa = empresaEditada;

        // Actualizar el archivo empresa.json
        const filePath = path.join(__dirname, '../config/empresa.json');
        const newData = JSON.stringify(empresaEditada, null, 2);

        fs.writeFileSync(filePath, newData);

        console.log('Datos actualizados correctamente');
        res.status(200).json({ message: 'Datos actualizados correctamente' });
    } catch (error) {
        console.error('Hubo un error al intentar actualizar los datos:', error.message);
        res.status(500).json({ message: 'Hubo un error al intentar actualizar los datos', details: error.message });
    }
};

//METODOS PARA LA VISTA RESOLUCION

configCtrl.createDatosLey = async (req, res) => {
    const { mensaje1, mensaje2, resolucionNum, fechaRes, autoriza, numInicio, fechaVigencia } = req.body;
    
    try {
    const mensajesLey = new MensajesLey({
    mensaje1,
    mensaje2,
    resolucionNum,
    fechaRes,
    autoriza,
    numInicio,
    fechaVigencia
    })
    
    await mensajesLey.save()
    res.send('los mensajes de ley han sido guardados')
    } catch (error) {
    res.status(500).json({message: 'hubo un error al intentar guardar los datos', details: error.message})
    }
}

//metodo para consultar los mensajes de ley
configCtrl.datosDeLeyConfig = async (req, res) => {
    try {
    const mensajesLey = await MensajesLey.find({} )
    res.json(mensajesLey)
    } catch (error) {
    res.status(500).json({message: 'hubo un error al intentar Obtener los datos', details: error.message})
    }
    
};

//metodo para actualizar mensajesDeLey.json
configCtrl.updateMensajesLey = async (req, res) => {
    const { id } = req.params
    
    const edicionMensajes = {
    mensaje1: req.body.mensaje1,
    mensaje2: req.body.mensaje2,
    resolucionNum: req.body.resolucionNum,
    fechaRes: req.body.fechaRes,
    autoriza: req.body.autoriza,
    numInicio: req.body.numInicio,
    numFinal: req.body.numFinal,
    fechaVigencia: req.body.fechaVigencia
    }
    
    try{
    const mensActualizado = await MensajesLey.findByIdAndUpdate(id, { $set: edicionMensajes }, { new:true })
    if (!mensActualizado){
    return res.status(404).json({ error: 'no se encontro el registro' })
    }
    res.send('mesajes de ley a sido Actualizado Exitosamente')
    
    } catch (error) {
    console.error('Hubo un error al intentar actualizar los datos:', error.message);
    res.status(500).json({ message: 'Hubo un error al intentar actualizar los datos', details: error.message });
    }
};

//METODOS PARA LA VISTA DE MENSAJES ADICIONALES

configCtrl.adicionalesConfig = (req, res) => {
    try {
        res.json(Mensajes)
    } catch (error) {
        res.status(500).json({message: 'hubo un error al intentar Obtener los datos', details: error.message})
    }
    
};

configCtrl.updateMensajes = (req, res) => {
    try {
        const mensajesEditada = {
            mensaje1: req.body.mensaje1,
            mensaje2: req.body.mensaje2,
            mensaje3: req.body.mensaje3,
            mensaje4: req.body.mensaje4,
           
        };

        // Actualizar la variable local
        
        Mensajes = mensajesEditada;

        // Actualizar el archivo empresa.json
        const filePath = path.join(__dirname, '../config/mensajesAdicionales.json');
        const newData = JSON.stringify(mensajesEditada, null, 2);

        fs.writeFileSync(filePath, newData);

        console.log('Datos actualizados correctamente');
        res.status(200).json({ message: 'Datos actualizados correctamente' });
    } catch (error) {
        console.error('Hubo un error al intentar actualizar los datos:', error.message);
        res.status(500).json({ message: 'Hubo un error al intentar actualizar los datos', details: error.message });
    }
};

//metodo para guardar numero actual
configCtrl.saveNumActual = async (req, res) => {
const { numActual } = req.body;

try {
// Verificar si hay algún documento existente en la colección Config
const existingConfig = await Config.findOne();

if (existingConfig) {
// Si ya hay un documento existente, actualizar el número actual en ese documento
existingConfig.numActual = numActual;
await existingConfig.save();
res.send('Número actualizado con éxito!');
} else {
// Si no hay ningún documento existente, crear uno nuevo con el número actual proporcionado
const config = new Config({ numActual });
await config.save();
res.send('Número actual creado con éxito!');
}
} catch (error) {
res.status(500).json({ message: 'Hubo un error al intentar guardar/actualizar el número actual', details: error.message });
}
}


//metodo para consultar el nuemro actual
configCtrl.getNumActual = async(req, res) => {
try {
const numActual = await Config.find({}, 'numActual _id' )
res.json(numActual)

} catch (error) {
console.error(error);
res.status(500).json({ error: 'Error al obtener los registros', details: error.message });
}
}

//Metodo para actualizar numero actual
configCtrl.updateNumActual = async(req, res) => {
const { id } = req.params;

const numEditado = { numActual: req.body.numActual }

try {
const numActualizado = await Config.findByIdAndUpdate(id, { $set: numEditado }, { new: true });
if(!numActualizado){
return res.status(404).json({ message: 'no se encontro registro en numActual' })
}
res.send('numActual Actualizado')
} catch (error) {
res.status(500).json({ error: 'Error al intentar actualizar el numero Actual', details: error.message });
}
}


module.exports = configCtrl;

