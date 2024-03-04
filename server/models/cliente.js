const mongoose = require('mongoose');
const {Schema} = mongoose;

const ClienteSchema = new Schema({
    nit: {type: Number, required:true},
    nombre: {type: String, required:true},
    direccion: {type: String, required:true},
    telefono: {type: Number, required:true},
});

module.exports = mongoose.model('clientes', ClienteSchema);