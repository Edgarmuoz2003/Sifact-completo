import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/estilos-facturacion.css';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

function Facturacion({ nombre }) {

  const [fecha, setFecha] = useState('');
  const [autoriza, setAutoriza] = useState('');
  const [numInicio, setNumInicio] = useState();
  const [numActual, setNumActual] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [productosFacturados, setProductosFacturados] = useState([]);
  const [totalFactura, setTotalFactura] = useState(0);
  const [resolucion, setResolucion] = useState(null)

  const obtenerFecha = () => {
    const fechaActual = new Date().toISOString().split('T')[0];
    setFecha(fechaActual)
  }

  const obtenerNumero = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/config/resolucion');
      const data = response.data[0];
      setResolucion(data)
      setAutoriza(data.autoriza); 
      setNumInicio(data.numInicio);

      const verificarNum = await axios.get('http://localhost:3000/api/config/numActual');
      const numVerificado = verificarNum.data[0];

      if (!numVerificado) {
        await axios.post('http://localhost:3000/api/config/numActual', { numActual: numInicio });
        setNumActual(`${autoriza} - 0000${numInicio}`);
      } else {
        const id = numVerificado._id;
        const nuevoNumero = numVerificado.numActual + 1;
        
        await axios.put(`http://localhost:3000/api/config/numActual/${id}`, { numActual: nuevoNumero });
        setNumActual(`${autoriza} - 0000${nuevoNumero}`); 
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const mostrarNumeroActual = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/config/resolucion');
      const data = response.data[0];
      setAutoriza(data.autoriza);
      setNumInicio(data.numInicio); 

      const verificarNum = await axios.get('http://localhost:3000/api/config/numActual');
      const numVerificado = verificarNum.data[0];

      if (!numVerificado) {
        setNumActual(`${autoriza} - 0000${numInicio}`);
      } else {
        const nuevoNumero = numVerificado.numActual;
        setNumActual(`${data.autoriza} - 0000${nuevoNumero}`);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }   
  };  

  const showEmpresa = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/config/empresa')
      const empresaData = response.data
      setEmpresa(empresaData)
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

  useEffect(() => {
    obtenerFecha(); 
    mostrarNumeroActual()
    showEmpresa()
  }, []);

  //SECCION DATOS DEL CLIENTE

  const [nit, setNit] = useState('99');
  const [cliente, setCliente] = useState(null)

  const manejarCambios = (event) => {
    setNit(event.target.value)
  };

  const manejarBusqueda = async (event) => {
    if(event.key === 'Enter'){
      try {
        const response = await axios.get(`http://localhost:3000/api/cliente/${nit}`)
        const data = response.data;
        setCliente(data);
        codigoRef.current.focus(); // Cambio de foco al campo de Código
      } catch (error) {
        console.error('Error al buscar cliente:', error);
        setCliente(null);
      }
    }
  }

  //SECCION PRODUCTOS A FACTURAR

  const [codigo, setCodigo] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(null);
  const [error, setError] = useState('');
  const codigoRef = useRef(null); // Referencia al campo de Código
  const cantidadRef = useRef(null);

  const mCambiosCod = (event) => {
    setCodigo(event.target.value)
  }

  const mBusquedaCod = async (event) => {
    if(event.key === 'Enter'){
      try {
        const response = await axios.get(`http://localhost:3000/api/productos/${codigo}`)
        const producData = response.data
        setProducto(producData)
        cantidadRef.current.focus();
      } catch (error) {
        console.error('Error al buscar producto', error);
      }
    }
  }

  //SECCION DE DETALLES DE PRODUCTOS

  const mCambiosCan = (event) => {
    setCantidad(event.target.value)
  }

  const mOpercacionesCan = async (event) => {
    if (event.key === 'Enter') {
      if (cantidad) {
        const totalproducto = await producto.precio * cantidad;
        const impuesto = await producto.impuesto * totalproducto / 100;
        const bruto = totalproducto - impuesto;
  
        // Agregar el producto con los valores calculados a la tabla
        agregarProductoConValores(totalproducto, impuesto, bruto);
  
        // Limpiar campos para el próximo producto
        limpiarCampos();


      } else {
        setError('Ingrese una Cantidad');
      }
    }
  };

  const limpiarCampos = () => {
    setCodigo(''); // Limpiamos el campo de código
    setProducto(null); // Reiniciamos el producto a null
    setCantidad(''); // Reiniciamos la cantidad
    setError(''); // Reiniciamos el mensaje de error
    codigoRef.current.focus(); // Enfocamos nuevamente el campo de código
  };

  const agregarProductoConValores = (totalproducto, impuesto, bruto) => {
    const nuevoProducto = {
      codigo: producto.codigo,
      descripcion: producto.descripcion,
      precioUnitario: producto.precio,
      cantidad: cantidad,
      porcentajeIVA: producto.impuesto,
      subTotal: bruto, // Usamos bruto como subTotal ya que este es el total sin impuestos
      iva: impuesto,
      total: totalproducto // Total incluye impuestos
    };
    const nuevosProductosFacturados = [...productosFacturados, nuevoProducto];
    setProductosFacturados(nuevosProductosFacturados);
    
    // Recalcular el total de la factura
    const nuevoTotalFactura = calcularTotalFactura(nuevosProductosFacturados);
    setTotalFactura(nuevoTotalFactura);
  };

  const calcularTotalFactura = (productos) => {
    let total = 0;
    productos.forEach((producto) => {
      total += producto.total;
    });
    return total;
  };

  //SECCION DE METODOS DE LOS BOTONES DE GUARDAR Y OTROS

  const guardarFactura = async () => {
    try {
      // Construir el objeto de factura con los datos necesarios
      const productosFactura = productosFacturados.map(producto => ({
        codigoProducto: producto.codigo,
        descripcionProducto: producto.descripcion,
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario,
        subTotal: producto.subTotal,
        iva: producto.iva,
        total: producto.total
      }));
  
      const facturaData = {
        numeroFactura: numActual,
        cliente: cliente._id,
        productos: productosFactura,
        totalFactura: totalFactura
      };
  
      // Enviar la solicitud POST al backend para guardar la factura
      await axios.post('http://localhost:3000/api/facturacion', facturaData);
      await generarPDF()
      await resetValores();
      Swal.fire({
        title: "¡Factura guardada con éxito!",
        text: "La factura se ha guardado correctamente.",
        icon: "success",
        timer: 3000
      });

      // Si la factura se guarda correctamente, actualizar el número de factura
      await obtenerNumero();
    } catch (error) {
      console.error('Error al guardar la factura:', error);
    }
  };

  const resetValores = () => {
    // Limpiar y reinicializar los campos de datos del cliente
    setNit(99);
    setCliente(null);
  
    // Limpiar y reinicializar los campos de productos a facturar
    setCodigo("");
    setCantidad('');
    setProducto(null);
  
    // Limpiar y reinicializar los campos de detalles de los productos (tabla)
    setProductosFacturados([]);
    setTotalFactura(0);
  };

  const generarPDF = async () => {
    try {
      // Crear el documento PDF
      const doc = new jsPDF();
  
      // Agregar los datos del almacén (empresa)
      doc.text(empresa.nombre, 15, 15);
      doc.text(`NIT: ${empresa.nit}`, 15, 25);
      doc.text(`Dirección: ${empresa.direccion}`, 15, 35);
      doc.text(`Teléfono: ${empresa.telefono}`, 15, 45);
  
      // Agregar número de factura y fecha
      doc.text(`Número de Factura: ${numActual}`, 150, 15);
      doc.text(`Fecha: ${fecha}`, 150, 25);
  
      // Agregar datos del cliente
      doc.text("DATOS DEL CLIENTE", 15, 65);
      doc.text(`NIT: ${cliente ? cliente.nit : ""}`, 15, 75);
      doc.text(`Nombre: ${cliente ? cliente.nombre : ""}`, 15, 85);
      doc.text(`Dirección: ${cliente ? cliente.direccion : ""}`, 15, 95);
      doc.text(`Teléfono: ${cliente ? cliente.telefono : ""}`, 15, 105);
  
      // Agregar sección de detalles y conceptos
      doc.text("DETALLES Y CONCEPTOS", 15, 125);
      let y = 135; // Variable para controlar la posición en y
      productosFacturados.forEach((producto, index) => {
        doc.text(`${producto.codigo}`, 15, y);
        doc.text(`${producto.descripcion}`, 40, y);
        doc.text(`${producto.precioUnitario}`, 90, y);
        doc.text(`${producto.cantidad}`, 120, y);
        doc.text(`${producto.porcentajeIVA}`, 150, y);
        doc.text(`${producto.subTotal}`, 170, y);
        doc.text(`${producto.iva}`, 190, y);
        doc.text(`${producto.total}`, 210, y);
        y += 10; // Incrementar la posición en y para el próximo producto
      });
  
      // Agregar mensajes adicionales obtenidos mediante consulta Axios
      const mensajesAdicionales = await obtenerMensajesAdicionales();
      doc.text(mensajesAdicionales, 15, y + 20);
  
      // Obtener el total de la factura
      const totalFactura = productosFacturados.reduce((total, producto) => total + producto.total, 0);
      doc.text(`Total Factura: $${totalFactura.toFixed(2)}`, 15, y + 40);
  
      // Guardar el PDF con el número de factura como nombre del archivo
      doc.save(`${numActual}.pdf`);
  
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };
  
  const obtenerMensajesAdicionales = async () => {
    try {
      // Hacer la consulta Axios para obtener los mensajes adicionales
      const response = await axios.get('http://localhost:3000/api/config/mensajes');
      const mensajes = response.data;
  
      // Construir la cadena de mensajes adicionales
      let mensajesConcatenados = '';
      for (let key in mensajes) {
        mensajesConcatenados += mensajes[key];
      }
  
      return mensajesConcatenados;
    } catch (error) {
      console.error('Error al obtener los mensajes adicionales:', error);
      return ''; // Retornar una cadena vacía en caso de error
    }
  };
  
  
  


  return (
    <div className="container principal">
      <section className="seccion-datosfac row">
        <div className="col-md-6">
          <div className="datos-empresa">
            {empresa && (
              <>
                <div>
                  <label htmlFor="nombre" style={{ color: 'blue', fontSize: '1.8em' }}>{empresa.nombre}</label>
                </div>
                <div>
                  <label htmlFor="nit">NIT: {empresa.nit}</label>
                </div>
                <div>
                  <label htmlFor="direccion">Dirección: {empresa.direccion}</label>
                </div>
                <div>
                  <label htmlFor="telefono">Teléfono: {empresa.telefono}</label>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="datos-factura">
            <div className="form-group">
              <label htmlFor="numeroFactura">Numero de Factura:</label>
              <input
                type="text"
                className="form-control"
                id="numeroFactura"
                value={numActual}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaFactura">Fecha:</label>
              <input
                type="Date"
                className="form-control"
                id="fechaFactura"
                value={fecha}
                readOnly
              />
            </div>
          </div>
        </div>
      </section>
      <section className="seccion_clientes_fac row">
        <h2>Datos del cliente</h2>
        <div className="col-md-6">
          <div className="datos-cliente">
            <div className="form-group">
              <label htmlFor="nit">NIT:</label>
              <input
                type="text"
                className="form-control"
                id="nit"
                value={nit}
                onChange={manejarCambios}
                onKeyPress={manejarBusqueda}
              />
            </div>
            {cliente && (
              <>
                <label htmlFor="nombre">{cliente.nombre}</label>
                <br />
                <label htmlFor="direccion">{cliente.direccion}</label>
                <br />
                <label htmlFor="telefono">{cliente.telefono}</label>
                <br />
              </>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="total-box">
            <div className="total-header" style={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>
              Total Factura
            </div>
            <div className="total-value" style={{ textAlign: 'center' }}>
              {`$ ${totalFactura.toFixed()}`} {/* Mostrar el valor total de la factura en pesos colombianos */}
            </div>
          </div>
        </div>
      </section>
      <section className="seccion-productos">
        <h2>Producto a Facturar</h2>
        <div >
          <label htmlFor="Código">Código</label>
          <input 
            type="text" 
            className="input-cod" 
            placeholder="Código del Producto" 
            aria-label="Código" 
            aria-describedby="basic-addon1" 
            value={codigo}
            onChange={mCambiosCod}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                mBusquedaCod(event);
              }
            }}
            ref={codigoRef} 
            required
          />
        </div>
        <div >
          <label htmlFor="Descripcion">Descripcion</label>
          <input 
            type="text" 
            className="input-des" 
            placeholder="Descripcion" 
            value={producto ? producto.descripcion : ''}
            aria-label="Descripcion" 
            aria-describedby="basic-addon1" disabled 
          />
        </div>
        <br/>
        <div >
          <label htmlFor="Cantidad">Cantidad</label>
          <input 
            type="number" 
            className="input-can" 
            placeholder="Cantidad" 
            value={cantidad}
            onChange={mCambiosCan}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                mOpercacionesCan(event);
              }
            }}
            aria-label="Cantidad" 
            aria-describedby="basic-addon1" 
            ref={cantidadRef} required
          />
         </div>
        <div >
          <label htmlFor="Precio">Precio</label>
          <input 
            type="text" 
            className="input-pre"
            placeholder="Precio" 
            value={producto ? producto.precio : ''}
            aria-label="Precio" 
            aria-describedby="basic-addon1" disabled 
          />
        </div>
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </section>
      {/* Aquí agregamos la tabla para mostrar los productos facturados */}
      <section className="seccion-productos-facturados">
        <h2>Detalles y conceptos</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>%IVA</th>
              <th>Sub-Total</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productosFacturados.map((producto, index) => (
              <tr key={index}>
                <td>{producto.codigo}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precioUnitario}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.porcentajeIVA}</td>
                <td>{producto.subTotal}</td>
                <td>{producto.iva}</td>
                <td>{producto.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="seccion-botones">
        <button className="btn btn-primary" onClick={guardarFactura}>Guardar Factura</button>
        <button type="button" className="btn btn-secondary" onClick={resetValores}>Cancelar</button>
      </div>
    </div>
  );
}

export default Facturacion;

