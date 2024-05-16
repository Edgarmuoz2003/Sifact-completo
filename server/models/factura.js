const mongoose = require('mongoose');

const { Schema } = mongoose;

const productoSchema = new Schema({
    codigoProducto: { type: String, required: true },
    descripcionProducto: { type: String, required: true },
    precioUnitario: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    iva: { type: Number, required: true },
    total: { type: Number, required: true }
});

const facturaSchema = new Schema({
    numeroFactura: { type: String, required: true },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente', // Referencia al modelo de Cliente
        required: true
    },
    productos: [productoSchema], // Array de objetos producto
    totalFactura: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

const Factura = mongoose.model('Factura', facturaSchema);

module.exports = Factura;
