import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import '../css/estilos-empleados.css';
import Swal from 'sweetalert2';

function Productos() {
  const [agregar, setAgregar] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [id, setId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState();
  const [impuesto, setImpuesto] = useState();
  const [productos, setProductos] = useState(null); 
  const [editar, setEditar] = useState(false);

  //metodos principales
  //metodo para agregar
  const add = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/productos", {
        codigo: codigo,
        descripcion: descripcion,
        precio: precio,
        impuesto: impuesto
      });
      await limpiarCampos();
      Swal.fire({
        title: "Registro Exitoso!",
        html: "<i>se a agregado <strong>" + descripcion + "</strong>  a la lista de productos </i>",
        icon: "success",
        timer: 3000
      });
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  };

  //metodo para buscar un cliente
  const buscarProducto = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/productos/${codigo}`);
      const producto = response.data;
      setProductos(producto); 
      limpiarCampos();
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      
      if (error.response && error.response.status === 404) {
        // Mostrar SweetAlert para indicar que el cliente no fue encontrado
        Swal.fire({
          title: "Producto no encontrado",
          text: "No se encontró ningún Producto con ese código.",
          icon: "error",
          timer: 3000
        });
      }
    }
  };

  //metodo para actualizar empleado
  const update = async (event) => {
    event.preventDefault();

    await axios.patch("http://localhost:3000/api/productos/" + id, {
      id: id,
      codigo: codigo,
      descripcion: descripcion,
      precio: precio,
      impuesto: impuesto
    });
    await limpiarCampos();
    setProductos(null); 
    Swal.fire({
      title: "Actualizacion Exitosa!",
      html: "<i>El producto <strong>" + descripcion + "</strong>  fue Actualizado con exito </i>",
      icon: "success",
      timer: 3000
    });
  };

  //metodo para eliminar clientes
  const borrar = (producto) => {
    Swal.fire({
      title: "confirmar?",
      text: "confirmas que quieres eliminar a " + producto.descripcion + " ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/productos/${producto._id}`).then(() => {
          limpiarCampos();
          setProductos(null); 
          Swal.fire({
            title: "Eliminado!",
            text: producto.descripcion + ' fue eliminado',
            icon: "success",
            timer: 3000
          });
        });
      }
    });
  };

  //metodos secundarios
  const mostrarAgregar = () => {
    setAgregar(!agregar);
  }; 

  const limpiarCampos = () => {
    setCodigo("");
    setDescripcion("");
    setPrecio("");
    setImpuesto("");
    setEditar(false);
  };

  const editarProducto = (producto) => {
    setEditar(true);
    setCodigo(producto.codigo);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setImpuesto(producto.impuesto);
    setId(producto._id);
  };

  return (
    <div className="container g-empleados">
      <div className="card text-center">
        <div className="card-header">
          <h1>Gestion de Productos</h1>
        </div>

        <div className="form-check form-switch d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            checked={agregar}
            onChange={mostrarAgregar}
          />
          <label className="form-check-label ms-2" htmlFor="flexSwitchCheckChecked">
            {agregar ? 'Agregar nuevo Producto' : 'Buscar Producto'}
          </label>
        </div>

        {agregar ? (
          <div className="card-body">
            <form>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Codigo</span>
                <input
                  onChange={(event) => {
                    setCodigo(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={codigo}
                  placeholder="Ingrese el Codigo"
                  aria-label="codigo"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Descripcion</span>
                <input
                  onChange={(event) => {
                    setDescripcion(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={descripcion}
                  placeholder="Ingrese Descripcion Detallada del Producto"
                  aria-label="descripcion"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Precio</span>
                <input
                  onChange={(event) => {
                    setPrecio(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={precio}
                  placeholder="Ingrese el precio de venta sin puntos ni comas"
                  aria-label="precio"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">% de Impuesto</span>
                <input
                  onChange={(event) => {
                    setImpuesto(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={impuesto}
                  placeholder="Ingrese el % de impuesto segun la ley vigente"
                  aria-label="impuesto"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" onClick={add}>Agregar</button>
            </form>
          </div>
        ) : (
          <div className="card-body">
            <form>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Codigo</span>
                <input
                  onChange={(event) => {
                    setCodigo(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={codigo}
                  placeholder="Ingrese el Codigo del producto"
                  aria-label="codigo"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              {editar ? (
                <>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Descripcion</span>
                    <input
                      onChange={(event) => {
                        setDescripcion(event.target.value);
                      }}
                      type="text"
                      className="form-control"
                      value={descripcion}
                      placeholder="Ingrese la descripcion del producto"
                      aria-label="descripcion"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Precio</span>
                    <input
                      onChange={(event) => {
                        setPrecio(event.target.value);
                      }}
                      type="number"
                      className="form-control"
                      value={precio}
                      placeholder="Ingrese el precio de venta"
                      aria-label="precio"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">% de Impuesto</span>
                    <input
                      onChange={(event) => {
                        setImpuesto(event.target.value);
                      }}
                      type="number"
                      className="form-control"
                      value={impuesto}
                      placeholder="Ingrese el % de impuesto segun la ley vigente"
                      aria-label="impuesto"
                      aria-describedby="basic-addon1"
                      required
                    />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={update}>
                    Guardar Cambios
                  </button>

                </>
              ) : (
                <>
                  <button type="button" className="btn btn-primary" onClick={buscarProducto}>
                    Buscar
                  </button>

                  {productos !== null && (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Codigo</th>
                          <th>Descripcion</th>
                          <th>Precio de venta</th>
                          <th>% de Impuesto</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={productos._id}>
                          <td>{productos.codigo}</td>
                          <td>{productos.descripcion}</td>
                          <td>{productos.precio}</td>
                          <td>{productos.impuesto}</td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                              <button type="button" className="btn btn-info" onClick={(event) => editarProducto(productos)}>Actualizar</button>
                              <button type="button" onClick={() => borrar(productos)} className="btn btn-danger">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
