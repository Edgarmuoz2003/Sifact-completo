import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/estilos-facturacion.css";
import Swal from "sweetalert2";

function Facturacion({ nombre }) {
  //aqui se definen todas las constantes que se usaran en la interfaz de facturacion
  const [fecha, setFecha] = useState("");
  const [autoriza, setAutoriza] = useState("");
  const [numInicio, setNumInicio] = useState();
  const [numActual, setNumActual] = useState("");

  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [empresa, setEmpresa] = useState({});

  // Función para obtener la información de la empresa
  const obtenerEmpresa = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/config/empresa"
      );
      setEmpresa(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
    }
  };

  const [cliente, setCliente] = useState({
    nit: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const [nitInput, setNitInput] = useState("");

  //funcion para obtener la fecha del sistema
  const obtenerFecha = () => {
    const fechaActual = new Date().toISOString().split("T")[0];
    setFecha(fechaActual);
  };

  //funcion para obtener numero de factura
  const obtenerNumero = async () => {
    //esta seccion del codigo revisa en el archivo Mensajesdeley.json el numero inicial configurado por el usuario
    //y luego actualiza la tabla config de la base de datos con el numero
    try {
      const response = await axios.get(
        "http://localhost:3000/api/config/resolucion"
      );
      const data = response.data[0];
      console.log(data);
      setAutoriza(data.autoriza);
      setNumInicio(data.numInicio);

      const verificarNum = await axios.get(
        "http://localhost:3000/api/config/numActual"
      );
      const numVerificado = verificarNum.data[0]; // Acceder al primer elemento del array

      //aqui se ase la respectiva verificasion si no encuentra datos en la base de datos envia el numero configurado por el usuario
      if (!numVerificado) {
        await axios.post("http://localhost:3000/api/config/numActual", {
          numActual: numInicio,
        });
        const response = await axios.get(
          "http://localhost:3000/api/config/numActual"
        );
        const data = response.data[0];
        setNumInicio(data.numActual);
        setNumActual(`${autoriza} - 0000${numInicio}`);

        //en esta seccion si sí hay datos en la bd verifica cual es y le suma 1 y luego actualiza el valor en la bd
        //de modo que cada que se hace un llamado a la funcion la base de datos sumara un numero en numActual.
        //esta funcion debe usarse solo despues de haber verificado que la factura anterior se guardo exitosamente.
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
      const numVerificado = verificarNum.data[0]; // Acceder al primer elemento del array

      if (!numVerificado) {
        // Si no hay número en la base de datos, tomamos el número del archivo JSON
        setNumActual(`${autoriza} - 0000${numInicio}`);
      } else {
        const nuevoNumero = numVerificado.numActual;
        setNumActual(`${data.autoriza} - 0000${nuevoNumero}`);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const buscarClientePorNit = async (nit) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/cliente/${nit}`
      );
      const clienteEncontrado = response.data;

      if (clienteEncontrado) {
        //actualiza el estado del cliente encontrado con sus datos
        setCliente({
          nombre: clienteEncontrado.nombre,
          direccion: clienteEncontrado.direccion,
          telefono: clienteEncontrado.telefono,
          // almacenar solo el objeto del cliente
          _id: clienteEncontrado._id,
        });
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      // En caso de error, también establecer los datos del cliente en blanco
      setCliente({
        nombre: "",
        direccion: "",
        telefono: "",
        _id: "",
      });
      setNitInput("");
      Swal.fire({
        title: "cliente no encontrado!",
        html:
          "<i>el cliente  <strong> " +
          nitInput +
          "</strong> no esta  registrado  </i>",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const hasdleBuscarCliente = () => {
    // Verificar si el campo de NIT está vacío
    if (!nitInput.trim()) {
      // Si el campo está vacío, establecer los datos del cliente en blanco
      setCliente({
        nombre: "",
        direccion: "",
        telefono: "",
        _id: "",
      });
    }

    //llama la funcion para buscarl el cliente
    buscarClientePorNit(nitInput);
  };

  const buscarProducto = async (busqueda) => {
    try {
      let url = `http://localhost:3000/api/producto/`;

      if (!isNaN(busqueda)) {
        url += `?codigo=${busqueda}`;
      } else {
        url += `${busqueda}`;
      }

      const response = await axios.get(url);
      setProductos(response.data);
    } catch (error) {
      console.error("error al buscar el producto", error);
      setProductos([]);
    }
  };

  const agregarProducto = (producto) => {
    const total = producto.precio * producto.cantidad;
    const productoConTotal = { ...producto, total };
    const productoConCantidad = { ...producto, cantidad: 0 };
    setProductosSeleccionados([...productosSeleccionados, productoConTotal]);
  };

  const handleCantidadChange = (index, cantidad) => {
    const updatedProductos = [...productosSeleccionados];
    if (index >= 0 && index < updatedProductos.length) {
      const producto = updatedProductos[index];
      //actualiza la cantidad de productos
      producto.cantidad = cantidad;
      //calcula el iva
      const impuesto = producto.impuesto / 100;
      const iva = producto.precio * impuesto * cantidad;
      producto.iva = iva;
      //calcula el total (precio por cantida + iva)
      const total = producto.precio * cantidad;
      producto.total = total;
      //actualiza el precio de producto selccionado
      setProductosSeleccionados(updatedProductos);
    }
  };

  const eliminarProducto = (index) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos.splice(index, 1); //elimana el producto en el indice dado
    setProductosSeleccionados(updatedProductos);
  };

  // Calcular el total de la factura
  const totalFactura = productosSeleccionados.reduce((total, producto) => {
    return total + (producto.total || 0);
  }, 0);

  // Calcular el total del IVA para la factura
  const totalIVA = productosSeleccionados.reduce((total, producto) => {
    // Sumar el IVA de cada producto
    return total + (producto.iva || 0);
  }, 0);

  const precioBruto = totalFactura - totalIVA;

  const generarFactura = async () => {
    try {
      // Obtener el ObjectId del cliente
      const clienteId = cliente._id;

      // Obtener los productos seleccionados y los detalles del cliente
      const productosParaFactura = productosSeleccionados.map((producto) => ({
        producto: producto._id,
        codigo: producto.codigo,
        descripcion: producto.descripcion,
        precioUnidad: producto.precio,
        cantidad: producto.cantidad,
        iva: producto.iva,
      }));

      // Realizar la solicitud POST para guardar la factura en el servidor
      const response = await axios.post("http://localhost:3000/api/factura", {
        detalle: productosParaFactura,
        cliente: clienteId,
        totalNeto: totalFactura,
        numeroFactura: numActual,
      });

      console.log("Factura generada:", response.data);

      // Limpiar la lista de productos seleccionados después de generar la factura
      setProductosSeleccionados([]); // Limpiar la lista de productos seleccionados
      setNitInput(""); // Limpiar el estado de nitInput (input de búsqueda de cliente)
      setCliente({
        // Limpiar los datos del cliente
        nit: "",
        nombre: "",
        direccion: "",
        telefono: "",
      });
      setBusqueda(""); // Limpiar el estado de busqueda (input de búsqueda de productos)
      setProductos([]); //elimina la tabla de resultado de busqueda
      obtenerNumero();

      // Mostrar mensaje de éxito al usuario
      alert("¡Factura generada con éxito!");
    } catch (error) {
      console.error("Error al generar factura:", error);

      // Mostrar mensaje de error al usuario
      alert("¡Error al generar la factura!");
    }
  };

  //esta funcion se encarga de que la funcion obtener fecha se ejecute y muestre
  //la fecha apenas se renderice la pagina
  useEffect(() => {
    obtenerFecha();
    mostrarNumeroActual();
    obtenerEmpresa();
  }, []);

  const handleSubmitC = (e) => {
    e.preventDefault();
    hasdleBuscarCliente();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarProducto(busqueda);
  };

  return (
    <div className="containerPrincipal">
      <h1>Facturación</h1>
      <section className="seccion-datosfac numFactura">
        {/* Aquí se muestra la información de la empresa */}
        <div>
          <h4>Información de la Empresa:</h4>
          <p>NIT: {empresa.nit}</p>
          <p>Nombre: {empresa.nombre}</p>
          <p>Dirección: {empresa.direccion}</p>
          <p>Teléfono: {empresa.telefono}</p>
        </div>
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
      </section>
      <section className="secDatosCliente">
        <div className="datosClientes">
          <h2>datos del cliente </h2>
          <div className=" buscarCliente">
            <form className="forBuscar" onSubmit={handleSubmitC}>
              <div className="inútbuscarCliente">                
                  <label>NIT del cliente</label>
                  <input
                    type="text"
                    className="inputClienteID"
                    value={nitInput}
                    onChange={(e) => setNitInput(e.target.value)}
                  />                
              </div>
              <div className="contenedorPrecio">
                <h3>total factura</h3>
                <p>
                  {totalFactura.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </form>
          </div>
          <div className=" contenedorCliente">
            <div>
              <p>{cliente.nombre}</p>

              <p>{cliente.direccion}</p>

              <p>{cliente.telefono}</p>
            </div>
          </div>
          
        </div>
      </section>

      <section className="busquedaProductos">
        <h2>datos de los productos</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>DESCRIPCION PRODUCTO</label>
              <input
                type="text"
                className="inputProd"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button type="submit" className="btn btn-success">
                buscar producto
              </button>
            </div>
          </div>
        </form>
        <div className="contenedorResultadosProductos">
          <h2>resultado de busqueda de los productos</h2>
          <table>
            <thead>
              <tr>
                <th>codigo</th>
                <th>nombre</th>
                <th>precio</th>
                <th>cantidad</th>
                <th></th> {/**columna para el boron agregar */}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.codigo}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.cantidad}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => agregarProducto(producto)}
                    >
                      agregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="productosSelec">
        <h2>productos seleccionados</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>iva</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productosSeleccionados.map((producto, index) => (
              <tr key={index}>
                <td>{producto.codigo}</td>
                <td>{producto.descripcion}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleCantidadChange(index, parseInt(e.target.value, 10))
                    }
                  />
                </td>
                <td>${producto.precio}</td>
                <td>{producto.iva}</td>
                <td>${producto.total}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => eliminarProducto(producto)}
                  >
                    eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">
                <strong>Total de la Factura:</strong>
              </td>
              <td>
                total bruto:{" "}
                {precioBruto.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </td>
              <td>
                total iva:{" "}
                {totalIVA.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </td>
              <td>
                valor neto:{" "}
                {totalFactura.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </td>
            </tr>
          </tfoot>
        </table>
        <button className="btn btn-success btnGenerar" onClick={generarFactura}>
          Generar Factura
        </button>
      </section>
    </div>
  );
}

export default Facturacion;
