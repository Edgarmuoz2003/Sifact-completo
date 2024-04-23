import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/estilos-home.css';

function Facturacion() {
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [cliente, setCliente] = useState({
    nit: "",
    nombre: "",
    direccion: "",
    telefono: ""
  });

  const [nitInput, setNitInput] = useState("");

  const buscarClientePorNIT = async (nit) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cliente/${nit}`);
      const clienteEncontrado = response.data;

      if (clienteEncontrado) {
        // Actualizar el estado del cliente con los datos encontrados
        setCliente({
          nombre: clienteEncontrado.nombre,
          direccion: clienteEncontrado.direccion,
          telefono: clienteEncontrado.telefono,
          // Almacenar solo el ObjectId del cliente
          _id: clienteEncontrado._id
        });
      } else {
        // Si no se encuentra ningún cliente con el NIT especificado, limpiar el estado del cliente
        setCliente({
          nombre: "",
          direccion: "",
          telefono: "",
          _id: "" // Limpiar el ObjectId del cliente
        });
        console.log("Cliente no encontrado");
        // Puedes mostrar una alerta al usuario u otra acción
      }
    } catch (error) {
      console.error("Error al buscar el cliente:", error);
      // Manejar el error, por ejemplo, mostrar un mensaje de error al usuario
    }
  };

  const handleBuscarCliente = () => {
    // Llamar a la función para buscar cliente con el valor actual de nitInput
    buscarClientePorNIT(nitInput);
  };

  const buscarProducto = async (busqueda) => {
    try {
      let url = `http://localhost:3000/api/producto/`;
  
      // Determinar si la búsqueda es por descripción o por código
      if (!isNaN(busqueda))  { 
        url += `?codigo=${busqueda}`;
      } else { // Si no es un número (descripción)
        url += `${busqueda}`;
      }
  
      const response = await axios.get(url);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      setProductos([]); // Limpiar la lista de productos si hay un error
    }
  };

  const agregarProducto = (producto) => {
    const total = producto.precio * producto.cantidad;
    const productoConTotal = { ...producto, total };
    const productoConCantidad = { ...producto, cantidad: 0 };
    setProductosSeleccionados([...productosSeleccionados, productoConTotal]);
  };

  const eliminarProducto = (index) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos.splice(index, 1); // Eliminar el producto en el índice dado
    setProductosSeleccionados(updatedProductos);
  };


  const handleCantidadChange = (index, cantidad) => {
    const updatedProductos = [...productosSeleccionados];    
    if (index >= 0 && index < updatedProductos.length) {
      const producto = updatedProductos[index];      
      // Actualizar la cantidad del producto
      producto.cantidad = cantidad;  
      // Calcular el IVA
      const impuesto = producto.impuesto / 100;
      const iva = producto.precio * impuesto * cantidad;
      producto.iva = iva;  
      // Calcular el total (precio por cantidad + IVA)
      const total = producto.precio * cantidad ;
      producto.total = total;
      // Actualizar el estado de productos seleccionados
      setProductosSeleccionados(updatedProductos);
    }
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



    useEffect(() => {
      // Función para obtener la fecha actual en formato YYYY-MM-DD
      const getCurrentDate = () => {
        const now = new Date();
        const formattedDate = now.toISOString().split('T')[0];
        return formattedDate;
      };

    // Establecer la fecha actual al cargar el componente
    setFecha(getCurrentDate());
    }, []); // Ejecutar solo una vez al montar el componente
    
    const [ultimoNumeroFacturaEncontrado, setUltimoNumeroFacturaEncontrado] = useState();
    const [fecha, setFecha] = useState('');
    
    

  useEffect(() => {
    const getCurrentDate = () => {
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      return formattedDate;
    };

    const fetchLastFoundFacturaNumber = async () => {
      let nextNumber = 1;

      while (true) {
        try {
          const response = await axios.get(`http://localhost:3000/api/factura/${nextNumber}`);

          if (response.data) {
            nextNumber++;
          } else {
            // Cuando se encuentra un número no utilizado, establecerlo como el último encontrado
            setUltimoNumeroFacturaEncontrado(nextNumber);
           
            break;
          }
        } catch (error) {
          console.error("Error al verificar el número de factura:", error);
          break;
        }
      }
    };

    setFecha(getCurrentDate());
    fetchLastFoundFacturaNumber();
  }, []); // Ejecutar solo una vez al montar el componente



    const generarFactura = async () => {
      try {

        // Lógica para generar la factura y obtener el próximo número
        const numeroFactura = ultimoNumeroFacturaEncontrado + 1; // Siguiente número de factura
        // Obtener el ObjectId del cliente
        const clienteId = cliente._id;

        // Obtener los productos seleccionados y los detalles del cliente
        const productosParaFactura = productosSeleccionados.map((producto) => ({
          codigo: producto.codigo,
          descripcion: producto.descripcion,
          precio: producto.precio,
          cantidad: producto.cantidad,
          iva: producto.iva, 
        }));

        

    
        // Realizar la solicitud POST para guardar la factura en el servidor
        const response = await axios.post('http://localhost:3000/api/factura', {
          productos: productosParaFactura,
          cliente: clienteId,
          totalNeto: totalFactura,
          numeroFactura: numeroFactura,
          
        });

        setUltimoNumeroFacturaEncontrado(numeroFactura);
    
        console.log("Factura generada:", response.data);
        
        // Limpiar la lista de productos seleccionados después de generar la factura
        setProductosSeleccionados([]);
    
        // Mostrar mensaje de éxito al usuario
        alert("¡Factura generada con éxito!");
      } catch (error) {
        console.error("Error al generar factura:", error);
        
        // Mostrar mensaje de error al usuario
        alert("¡Error al generar la factura!");
      }
    };
    

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarProducto(busqueda);
  };

  return (
    <div className="container">
      <h1>Interfaz de Facturación</h1>

      <div>
        <div className="contenedorBuscar">
          <label>N° factura</label>
          <input
            type="number"
            value={ultimoNumeroFacturaEncontrado  }
            onChange={(e) => setUltimoNumeroFacturaEncontrado(parseInt(e.target.value))}
            disabled
          />
          <label>fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled/>
            
        </div>
      </div>

      <div className="my-4">
        <div className="contenedorBuscar">
          <div>
            <input
              type="text"
              className="inpuClien"
              placeholder="Ingrese NIT del Cliente"
              value={nitInput}
              onChange={(e) => setNitInput(e.target.value)}
            />
            <button              
              className="btn btn-success"
              onClick={handleBuscarCliente}
            >
              Buscar Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="my-4">
        <h3>Datos del Cliente:</h3>
        <form>
          <div className="form-row cliente">
            <div className="form-group col-md-4">
              <input
                type="text"
                placeholder="NOMBRE"
                className="inpuClien"
                value={cliente.nombre}
                onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
              />
            </div>
            <div className="form-group col-md-4">
              <input
                type="text"
                placeholder="DIRECCION"
                className="inpuClien"
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
              />
            </div>
            <div className="form-group col-md-4">            
              <input
                type="text"
                placeholder="TELEFONO"
                className="inpuClien"
                value={cliente.telefono}
                onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
              />
            </div>
          </div>
        </form>
      </div>
    
    
      
  
      <form onSubmit={handleSubmit} className="my-4">
        <div className="contenedorBuscar">
          <div >
            <input
              type="text"
              className="imptProd"
              placeholder="Descripción del Producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />  
            <button type="submit" className="btn btn-success">Buscar Producto</button>
          </div>
        </div>
      </form>

      <div className="my-4">
        <h3>Resultados de Búsqueda:</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th></th> {/* Columna para el botón de agregar */}
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => agregarProducto(producto)}
                  >
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-4">
        <h3>Productos Seleccionados:</h3>
        <table className="table">
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
                    onChange={(e) => handleCantidadChange(index, parseInt(e.target.value, 10))}
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
              <td colSpan="4"><strong>Total de la Factura:</strong></td>              
              <td>total bruto {precioBruto.toFixed(2)}</td>
              <td>total iva{totalIVA.toFixed(2)}</td>
              <td>valor neto ${totalFactura.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <button className="btn btn-success" onClick={generarFactura}>
          Generar Factura
        </button>
     
      </div>
    </div>
  );
}

export default Facturacion;
