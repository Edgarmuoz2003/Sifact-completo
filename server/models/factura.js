const mongoose = require('mongoose');
const { Schema } = mongoose;

const DetalleFacturaSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'producto'
    },
    cantidad: { type: Number, required: true },
    precioUnidad: { type: Number, required: true },
    iva: { type: Number, required: true },
    subTotal: { type: Number, required: true }
});

const FacturaSchema = new Schema({
    numeroFactura: { type: Number, required: true, unique: true },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'cliente'
    },
    fecha: { type: Date, default: Date.now, required: true },
    detalle: [DetalleFacturaSchema],
    totalNeto: { type: Number, required: true }
});



module.exports = mongoose.model('Factura', FacturaSchema);