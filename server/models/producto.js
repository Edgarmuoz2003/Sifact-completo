const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductoSchema = new Schema({
    codigo: {type: String, required:true},
    descripcion: {type: String, required:true},
    precio: {type: Number, required:true},
    impuesto: {type: Number, required:true},
})

module.exports = mongoose.model('productos', ProductoSchema);
