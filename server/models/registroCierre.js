const mongoose = require('mongoose');
const { Schema } = mongoose;

const RegistroCierreSchema = new Schema({
  fecha: { type: Date, required: true },
  total_ventas: { type: Number, required: true },
  contado: { type: Number, required: true },
  diferencia: { type: Number, required: true },
});

module.exports = mongoose.model('registroCierre', RegistroCierreSchema)