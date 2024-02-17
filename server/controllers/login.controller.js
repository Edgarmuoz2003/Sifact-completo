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
            res.status(401).send('Credenciales Incorrectas')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el Servidor');
    }
}

module.exports = loginCtrl; 