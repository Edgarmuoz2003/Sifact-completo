import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/estilos-facturacion.css";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import FacturaTable from "./FacturaTable";

function Facturacion({ nombre }) {
  const [fecha, setFecha] = useState("");
  const [autoriza, setAutoriza] = useState("");
  const [numInicio, setNumInicio] = useState();
  const [numActual, setNumActual] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [productosFacturados, setProductosFacturados] = useState([]);
  const [totalFactura, setTotalFactura] = useState(0);
  const [resolucion, setResolucion] = useState(null);

  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [showModal2, setShowModal2] = useState(false); // Estado para controlar la visibilidad del modal

  const [searchNumFactura, setSearchNumFactura] = useState("FOK3 - 0000"); // Estado para controlar el valor del input de búsqueda
  const [facturaEncontrada, setFacturaEncontrada] = useState(null);
  const [clienteFactura, setClienteFactura] = useState(null); // Estado para los datos del cliente asociado a la factura

  const buscarFactura = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/facturacion/${searchNumFactura}`
      );
      const data = response.data;
      setFacturaEncontrada(data);
      setShowModal(false); // Cerrar el modal después de la búsqueda
      setShowModal2(true);

      // Obtener los datos del cliente asociado a la factura
      if (data && data.factura && data.factura.cliente) {
        const clienteResponse = await axios.get(
          `http://localhost:3000/api/clientes/${data.factura.cliente}`
        );
        const clienteData = clienteResponse.data;
        setClienteFactura(clienteData);
      }
    } catch (error) {
      console.error("Error al buscar la factura:", error);
      setFacturaEncontrada(null);
      setClienteFactura(null);
      setShowModal(false); // Asegurarse de que el modal esté cerrado si no se encuentra la factura
      Swal.fire({
        title: "Factura no encontrada",
        text: `La factura con número ${searchNumFactura} no fue encontrada.`,
        icon: "error",
        timer: 3000,
      });
    }
  };

  const obtenerFecha = () => {
    const fechaActual = new Date().toISOString().split("T")[0];
    setFecha(fechaActual);
  };

  const obtenerNumero = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/config/resolucion"
      );
      const data = response.data[0];
      setResolucion(data);
      setAutoriza(data.autoriza);
      setNumInicio(data.numInicio);

      const verificarNum = await axios.get(
        "http://localhost:3000/api/config/numActual"
      );
      const numVerificado = verificarNum.data[0];

      if (!numVerificado) {
        await axios.post("http://localhost:3000/api/config/numActual", {
          numActual: numInicio,
        });
        setNumActual(`${autoriza} - 0000${numInicio}`);
      } else {
        const id = numVerificado._id;
        const nuevoNumero = numVerificado.numActual + 1;

        await axios.put(`http://localhost:3000/api/config/numActual/${id}`, {
          numActual: nuevoNumero,
        });
        setNumActual(`${autoriza} - 0000${nuevoNumero}`);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const mostrarNumeroActual = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/config/resolucion"
      );
      const data = response.data[0];
      setAutoriza(data.autoriza);
      setNumInicio(data.numInicio);

      const verificarNum = await axios.get(
        "http://localhost:3000/api/config/numActual"
      );
      const numVerificado = verificarNum.data[0];

      if (!numVerificado) {
        setNumActual(`${autoriza} - 0000${numInicio}`);
      } else {
        const nuevoNumero = numVerificado.numActual;
        setNumActual(`${data.autoriza} - 0000${nuevoNumero}`);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const showEmpresa = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/config/empresa"
    );
    const empresaData = response.data;
    setEmpresa(empresaData);
  };

  useEffect(() => {
    obtenerFecha();
    mostrarNumeroActual();
    showEmpresa();
  }, []);

  //SECCION DATOS DEL CLIENTE

  const [nit, setNit] = useState("");
  const [cliente, setCliente] = useState(null);

  const manejarCambios = (event) => {
    setNit(event.target.value);
  };

  const manejarBusqueda = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/cliente/${nit}`
        );
        const data = response.data;
        setCliente(data);
        codigoRef.current.focus(); // Cambio de foco al campo de Código
      } catch (error) {
        console.error("Error al buscar cliente:", error);
        setCliente(null);
        setNit("");
        Swal.fire({
          title: "cliente no encontrado!",
          html:
            "<i>el cliente  <strong> " +
            nit +
            "</strong> no esta  registrado  </i>",
          icon: "error",
          timer: 3000,
        });
      }
    }
  };

  //SECCION PRODUCTOS A FACTURAR

  const [codigo, setCodigo] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(null);
  const [error, setError] = useState("");
  const codigoRef = useRef(null); // Referencia al campo de Código
  const cantidadRef = useRef(null);

  const mCambiosCod = (event) => {
    setCodigo(event.target.value);
  };

  const mBusquedaCod = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/productos/${codigo}`
        );
        const producData = response.data;
        setProducto(producData);
        cantidadRef.current.focus();
      } catch (error) {
        console.error("Error al buscar producto", error);
      }
    }
  };

  //SECCION DE DETALLES DE PRODUCTOS

  const mCambiosCan = (event) => {
    setCantidad(event.target.value);
  };

  const mOpercacionesCan = async (event) => {
    if (event.key === "Enter") {
      if (cantidad) {
        const totalproducto = (await producto.precio) * cantidad;
        const impuesto = ((await producto.impuesto) * totalproducto) / 100;
        const bruto = totalproducto - impuesto;

        // Agregar el producto con los valores calculados a la tabla
        agregarProductoConValores(totalproducto, impuesto, bruto);

        // Limpiar campos para el próximo producto
        limpiarCampos();
      } else {
        setError("Ingrese una Cantidad");
      }
    }
  };

  const limpiarCampos = () => {
    setCodigo(""); // Limpiamos el campo de código
    setProducto(null); // Reiniciamos el producto a null
    setCantidad(""); // Reiniciamos la cantidad
    setError(""); // Reiniciamos el mensaje de error
    setNit("");
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
      total: totalproducto, // Total incluye impuestos
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

  const actualizarStock = async () => {
    try {
      // Iterar sobre los productos facturados
      for (const producto of productosFacturados) {
        // Obtener el producto de la base de datos
        const response = await axios.get(`http://localhost:3000/api/productos/${producto.codigo}`);
        const productoDB = response.data;
  
        if (!productoDB) {
          throw new Error(`El producto con código ${producto.codigo} no fue encontrado`);
        }
  
        // Almacenar el producto encontrado en una variable
        const productoEncontrado = productoDB;
  
        // Verificar si hay suficiente stock para realizar la venta
        if (productoEncontrado.stock < producto.cantidad) {
          console.error(`No se puede vender ${producto.descripcion} porque no hay suficiente en stock`);
          Swal.fire({
            title: "Stock insuficiente",
            text: `No se puede vender ${producto.descripcion} porque no hay suficiente en stock`,
            icon: "success",
            timer: 3000,
          });
          // Aquí podrías mostrar un mensaje al usuario si lo deseas
          continue; // Continuar con el siguiente producto en el bucle
        }
  
        // Calcular el nuevo stock restando la cantidad facturada del stock actual
        const nuevoStock = productoEncontrado.stock - parseInt(producto.cantidad);
  
        // Hacer la solicitud PUT al backend para actualizar el stock del producto
        await axios.patch(`http://localhost:3000/api/productos/${productoEncontrado._id}`, {
          stock: nuevoStock
        });
  
        
      }
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
    }
  };
  

  let productosSinStock = []; // Declaración global de la variable para almacenar los códigos de los productos sin suficiente stock

const verificarStockSuficiente = async () => {
    try {
        productosSinStock = []; // Limpiar el arreglo antes de verificar el stock

        // Iterar sobre los productos facturados
        for (const producto of productosFacturados) {
            const response = await axios.get(`http://localhost:3000/api/productos/${producto.codigo}`);
            const productoDB = response.data;

            if (!productoDB || producto.cantidad > productoDB.stock) {
                productosSinStock.push(producto.codigo); // Agregar el código del producto sin stock al arreglo
            }
        }

        if (productosSinStock.length > 0) {
            // Mostrar mensaje de advertencia con los códigos de los productos sin stock suficiente
            Swal.fire({
                title: "Productos sin stock suficiente",
                html: `Los siguientes productos no tienen suficiente stock para realizar la venta:<br><br>${productosSinStock.join(', ')}`,
                icon: "warning",
                timer: 5000,
            });
            return false; // Devolver falso si hay productos sin suficiente stock
        }
        
        return true; // Devolver verdadero si hay suficiente stock para todos los productos
    } catch (error) {
        console.error("Error al verificar el stock:", error);
        return false; // Devolver falso en caso de error
    }
};


  //SECCION DE METODOS DE LOS BOTONES DE GUARDAR Y OTROS

  const guardarFactura = async () => {
    try {

      /// Verificar si hay suficiente stock para todos los productos facturados
        const haySuficienteStock = await verificarStockSuficiente();

        if (!haySuficienteStock) {
            const productosSinStockStr = productosSinStock.join(', ');
            Swal.fire({
                title: "Productos sin stock suficiente",
                html: `Los siguientes productos no tienen suficiente stock para realizar la venta:<br><br>${productosSinStockStr}`,
                icon: "warning",
                timer: 5000,
            });
            return; // Detener la ejecución si no hay suficiente stock
        }

      // Construir el objeto de factura con los datos necesarios
      const productosFactura = productosFacturados.map((producto) => ({
        codigoProducto: producto.codigo,
        descripcionProducto: producto.descripcion,
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario,
        subTotal: producto.subTotal,
        iva: producto.iva,
        total: producto.total,
      }));

      const facturaData = {
        numeroFactura: numActual,
        cliente: cliente?._id,
        productos: productosFactura,
        totalFactura: totalFactura,
      };

      // Enviar la solicitud POST al backend para guardar la factura
      await axios.post("http://localhost:3000/api/facturacion", facturaData);
      await actualizarStock();
      await generarPDF();
      await resetValores();
      Swal.fire({
        title: "¡Factura guardada con éxito!",
        text: "La factura se ha guardado correctamente.",
        icon: "success",
        timer: 3000,
      });

      // Si la factura se guarda correctamente, actualizar el número de factura
      await obtenerNumero();
    } catch (error) {
      console.error("Error al guardar la factura:", error);
    }
  };

  const resetValores = () => {
    // Limpiar y reinicializar los campos de datos del cliente
    setNit();
    setCliente(null);

    // Limpiar y reinicializar los campos de productos a facturar
    setCodigo("");
    setCantidad("");
    setProducto(null);

    // Limpiar y reinicializar los campos de detalles de los productos (tabla)
    setProductosFacturados([]);
    setTotalFactura(0);
  };

  //GENERAR EL PDF DE LA FACTURA
  const generarPDF = async () => {
    try {
      // Crear el documento PDF
      const doc = new jsPDF();
      

      doc.setFontSize(12); // Aumentar el tamaño del texto

      // Agregar recuadro de fondo azul alrededor de todos los títulos
      doc.setFillColor(0, 51, 102); // Azul oscuro
      doc.setTextColor(255); // Blanco
      doc.rect(10, 10, 190, 10, "F"); // Rectángulo para "FACTURA DE VENTA"
      doc.rect(10, 53, 190, 10, "F"); // Rectángulo para "DATOS DEL CLIENTE"
      doc.rect(10, 88, 190, 10, "F"); // Rectángulo para "DETALLES Y CONCEPTOS"

      // Agregar texto "FACTURA DE VENTA" en azul
      doc.setTextColor(255); // Blanco
      doc.text("FACTURA DE VENTA", 85, 18); // Ajustar la posición del texto

      // Agregar los datos del almacén (empresa) en azul
      doc.setTextColor(0, 51, 102); // Azul oscuro
      doc.text(empresa.nombre, 20, 30);
      doc.text(`NIT: ${empresa.nit}`, 20, 35);
      doc.text(`Dirección: ${empresa.direccion}`, 20, 40);
      doc.text(`Teléfono: ${empresa.telefono}`, 20, 45);

      // Agregar número de factura y fecha en azul
      doc.setTextColor(0);
      doc.text(`Número de Factura: ${numActual}`, 130, 30);
      doc.text(`Fecha: ${fecha}`, 130, 38);

      // Agregar datos del cliente
      doc.setTextColor(255); // Negro
      doc.text("DATOS DEL CLIENTE", 85, 60);
      doc.setTextColor(0);
      doc.text(`NIT: ${cliente ? cliente.nit : ""}`, 20, 70);
      doc.text(`Nombre: ${cliente ? cliente.nombre : ""}`, 20, 75);
      doc.text(`Dirección: ${cliente ? cliente.direccion : ""}`, 20, 80);
      doc.text(`Teléfono: ${cliente ? cliente.telefono : ""}`, 20, 85);

      // Agregar sección de detalles y conceptos
      doc.setTextColor(255); // Blanco
      doc.text("Descripción", 15, 95);
      doc.text("Cantidad", 100, 95);
      doc.text("Precio X und", 120, 95);
      doc.text("Total", 180, 95);
      doc.setTextColor(0); // Negro
      let y = 105; // Variable para controlar la posición en y
      let totalIVA = 0;
      productosFacturados.forEach((producto, index) => {
        doc.text(`${producto.descripcion}`, 15, y);
        doc.text(`${producto.cantidad}`, 100, y);
        doc.text(`${producto.precioUnitario}`, 130, y);
        doc.text(`${producto.total}`, 180, y);
        totalIVA += producto.iva;
        y += 10; // Incrementar la posición en y para el próximo producto
      });

      //recta del final de productos
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(10, 225, 200, 225);

      // Obtener el total de la factura
      const totalFactura = productosFacturados.reduce(
        (total, producto) => total + producto.total,
        0
      );
      const subtotal = totalFactura - totalIVA;
      doc.rect(145, 235, 50, 10);
      doc.text(`Subtotal: $${subtotal.toFixed(0)}`, 150, 240);

      doc.rect(145, 245, 50, 10);
      doc.text(`Total IVA: $${totalIVA.toFixed(0)}`, 150, 250);

      doc.rect(145, 255, 50, 10);
      doc.text(`Total Factura: $${totalFactura.toFixed(0)}`, 150, 260);

      // Agregar mensajes adicionales obtenidos mediante consulta Axios
      const mensajesAdicionales = await obtenerMensajesAdicionales();

      doc.text(mensajesAdicionales.mensaje1, 15, 240);
      doc.text(mensajesAdicionales.mensaje2, 15, 250);
      doc.text(mensajesAdicionales.mensaje3, 15, 260);

      //recta del final
      doc.setLineWidth(0.5);
      doc.line(10, 285, 200, 285);

      //mensaje final
      doc.text(mensajesAdicionales.mensaje4, 85, 290);

      // Guardar el PDF con el número de factura como nombre del archivo
      doc.save(`${numActual}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const obtenerMensajesAdicionales = async () => {
    try {
      // Hacer la consulta Axios para obtener los mensajes adicionales
      const response = await axios.get(
        "http://localhost:3000/api/config/mensajes"
      );
      const mensajes = response.data;

      // Acceder a cada mensaje individualmente
      const mensaje1 = mensajes.mensaje1;
      const mensaje2 = mensajes.mensaje2;
      const mensaje3 = mensajes.mensaje3;
      const mensaje4 = mensajes.mensaje4;

      return { mensaje1, mensaje2, mensaje3, mensaje4 };
    } catch (error) {
      console.error("Error al obtener los mensajes adicionales:", error);
      return {}; // Retornar un objeto vacío en caso de error
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
                  <label
                    htmlFor="nombre"
                    style={{ color: "blue", fontSize: "1.8em" }}
                  >
                    {empresa.nombre}
                  </label>
                </div>
                <div>
                  <label htmlFor="nit">NIT: {empresa.nit}</label>
                </div>
                <div>
                  <label htmlFor="direccion">
                    Dirección: {empresa.direccion}
                  </label>
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
            <div
              className="total-header"
              style={{
                backgroundColor: "blue",
                color: "white",
                textAlign: "center",
              }}
            >
              Total Factura
            </div>
            <div className="total-value" style={{ textAlign: "center" }}>
              {`$ ${totalFactura.toFixed()}`}{" "}
              {/* Mostrar el valor total de la factura en pesos colombianos */}
            </div>
          </div>
        </div>
      </section>
      <section className="seccion-productos">
        <h2>Producto a Facturar</h2>
        <div>
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
              if (event.key === "Enter") {
                mBusquedaCod(event);
              }
            }}
            ref={codigoRef}
            required
          />
        </div>
        <div>
          <label htmlFor="Descripcion">Descripcion</label>
          <input
            type="text"
            className="input-des"
            placeholder="Descripcion"
            value={producto ? producto.descripcion : ""}
            aria-label="Descripcion"
            aria-describedby="basic-addon1"
            disabled
          />
        </div>
        <br />
        <div>
          <label htmlFor="Cantidad">Cantidad</label>
          <input
            type="number"
            className="input-can"
            placeholder="Cantidad"
            value={cantidad}
            onChange={mCambiosCan}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                mOpercacionesCan(event);
              }
            }}
            aria-label="Cantidad"
            aria-describedby="basic-addon1"
            ref={cantidadRef}
            required
          />
        </div>
        <div>
          <label htmlFor="Precio">Precio</label>
          <input
            type="text"
            className="input-pre"
            placeholder="Precio"
            value={producto ? producto.precio : ""}
            aria-label="Precio"
            aria-describedby="basic-addon1"
            disabled
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
        <button className="btn btn-primary" onClick={guardarFactura}>
          Guardar Factura
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={resetValores}
        >
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Buscar Factura
        </button>
      </div>

      {/* Modal para mostrar la factura encontrada */}
      {showModal2 && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            {" "}
            {/* Tamaño grande del modal */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Factura Encontrada</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal2(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Integra el componente FacturaTable y pasa la factura encontrada como prop */}
                {facturaEncontrada && (
                  <FacturaTable
                    factura={facturaEncontrada.factura}
                    cliente={clienteFactura}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal2(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Buscar Factura</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="buscarNumeroFactura" className="form-label">
                  Número de Factura:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buscarNumeroFactura"
                  value={searchNumFactura}
                  onChange={(e) => setSearchNumFactura(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={buscarFactura}
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Facturacion;
