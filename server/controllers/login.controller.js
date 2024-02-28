const bcrypt = require('bcrypt');
const Empledo = require('../models/empleado');
const jwt = require('jsonwebtoken');
const loginCtrl = {};

const secretKey = 'sifact'

loginCtrl.login = async (req, res) => {
    const { documento, contrasenia } = req.body;

    try {
        const empleado = await Empledo.findOne({ documento })

        if(empleado && bcrypt.compareSync(contrasenia, empleado.contrasenia)) {
            const token = jwt.sign({ usuario: empleado.nombre }, secretKey, { expiresIn: '1h' } )
            const { nombre } = empleado;
            res.status(200).json({ token, nombre })
        }else{
            res.json({ message: 'Credenciales Incorrectas' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el Servidor');
    }
}

loginCtrl.logout = (req, res) => {
    try {
        console.log('Solicitud de logout recibida');
        res.status(200).json({ message: 'La sesión se ha cerrado exitosamente' });
    } catch (error) {
        console.error('Error en el controlador de logout:', error);
        res.status(500).json({ error: 'Error en el Servidor' });
    }
};

module.exports = loginCtrl; 