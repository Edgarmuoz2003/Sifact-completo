import React from 'react';

const FacturaTable = ({ factura, cliente }) => {
  return (
    <div className="factura-table">
      <h3>Detalles de la Factura</h3>
      <table>
        <thead>
          <tr>
            <th>Número de Factura</th>
            <th>Cliente</th>
            <th>Cliente Nombre</th>
            <th>Cliente Dirección</th>
            <th>Cliente Teléfono</th>
            <th>Fecha</th>
            <th>Total de la Factura</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{factura.numeroFactura}</td>
            {/* Agregar una nueva celda para mostrar el nombre del cliente */}
            <td>{cliente ? cliente.nit : 'Cliente no encontrado'}</td>
            <td>{cliente ? cliente.nombre : 'Cliente no encontrado'}</td>
            <td>{cliente ? cliente.direccion : 'Cliente no encontrado'}</td>
            <td>{cliente ? cliente.telefono : 'Cliente no encontrado'}</td>
            <td>{factura.fecha}</td>
            <td>{factura.totalFactura}</td>
          </tr>
        </tbody>
      </table>
      <h4>Detalle de Productos</h4>
      <table>
        <thead>
          <tr>
            <th>Código Producto</th>
            <th>Descripción</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {factura.productos.map((producto) => (
            <tr key={producto._id}>
              <td>{producto.codigoProducto}</td>
              <td>{producto.descripcionProducto}</td>
              <td>{producto.precioUnitario}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.subTotal}</td>
              <td>{producto.iva}</td>
              <td>{producto.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    
  );
};

export default FacturaTable;