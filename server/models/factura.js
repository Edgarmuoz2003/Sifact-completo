const mongoose = require('mongoose');
const { Schema } = mongoose;

const FacturaSchema = new Schema({
    
    nombre: {type: String, required:true},
    direccion: {type: String, required:true},
    telefono: {type: Number, required:true},
    codigo: {type: String, required:true},
    descripcion: {type: String, required:true},
    precio: {type: Number, required:true},
    
    cantidad: {type: Number, required:true}
})

module.exports = mongoose.model('factura', FacturaSchema);
