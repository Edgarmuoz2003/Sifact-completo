const mongoose = require('mongoose');
const { Schema } = mongoose;

const CajaSchema = new Schema({
  fecha: { type: Date, required: true },
  empleado: { type: String, required: true },
  abierto: { type: Boolean, required: true },
  base: { type: Number, default: 0 },
  efectivo: { type: Number, default: 0 },
  diferencia: { type: Number, default: 0 },
});

module.exports = mongoose.model('caja', CajaSchema)