let Empresa = require('../config/empresa.json');
let Resolucion = require('../config/mensajesDeLey.json');
let Mensajes = require('../config/mensajesAdicionales.json')
const fs = require('fs');
const path = require('path');
const configCtrl = {};


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


//metodo para enviar al front los datos de la resolucion.json
configCtrl.datosDeLeyConfig = (req, res) => {
    try {
        res.json(Resolucion)
    } catch (error) {
        res.status(500).json({message: 'hubo un error al intentar Obtener los datos', details: error.message})
    }
    
};


//metodo para actualizar mensajesDeLey.json
configCtrl.updateResolucion = (req, res) => {
    try {
        const resolucionEditada = {
            mensaje1: req.body.mensaje1,
            mensaje2: req.body.mensaje2,
            resolucionNum: req.body.resolucionNum,
            fechaRes: req.body.fechaRes,
            autoriza: req.body.autoriza,
            numInicio: req.body.numInicio,
            numFinal: req.body.numFinal,
            fechaVigencia: req.body.fechaVigencia
        };

        // Actualizar la variable local

        Resolucion = resolucionEditada;

        // Actualizar el archivo empresa.json
        const filePath = path.join(__dirname, '../config/mensajesDeLey.json');
        const newData = JSON.stringify(resolucionEditada, null, 2);

        fs.writeFileSync(filePath, newData);

        console.log('Datos actualizados correctamente');
        res.status(200).json({ message: 'Datos actualizados correctamente' });
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


module.exports = configCtrl;

