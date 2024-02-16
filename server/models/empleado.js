const mongoose = require('mongoose');
const {Schema} = mongoose;

const EmpleadoSchema = new Schema({
    documento: {type: Number, required:true},
    nombre: {type: String, required:true},
    contrasenia: {type: String, required:true},
    cargo: {type: String, required:true},
});

module.exports = mongoose.model('empleados', EmpleadoSchema);