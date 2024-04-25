const mongoose = require('mongoose');
const {Schema} = mongoose;

const MensajesLeySchema = new Schema({
mensaje1: {type: String, required:true},
mensaje2: {type: String, required:true},
resolucionNum: {type: Number, required:true},
fechaRes: { type: Date, required:true },
autoriza: {type: String, required:true},
numInicio: {type: Number, required:true},
fechaVigencia: { type: Date, required:true },
});

module.exports = mongoose.model('mensajesLey', MensajesLeySchema);