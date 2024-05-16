import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import '../css/estilos-empleados.css';
import Swal from 'sweetalert2' 

function Clientes() {
  const [agregar, setAgregar] = useState(false);
  const [nit, setNit] = useState()
  const [id, setId] = useState("")
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState();
  const [cliente, setCliente] = useState(null)
  const [editar, setEditar] = useState(false);

  //metodos principales
//metodo para agregar
  const add = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/clientes", {
        nit: nit,
        nombre: nombre,
        direccion: direccion,
        telefono: telefono
      });
      await limpiarCampos();
      Swal.fire({
        title: "Registro Exitoso!",
        html: "<i>El cliente <strong>" + nombre + "</strong>  fue registrado con exito </i>",
        icon: "success",
        timer: 3000

      });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  //metodo para buscar un cliente
  const buscarCliente = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cliente/${nit}`);
      setCliente(response.data);
      limpiarCampos()
    } catch (error) {
      console.error("Error al buscar el cliente:", error);
      
      if (error.response && error.response.status === 404) {
        // Mostrar SweetAlert para indicar que el cliente no fue encontrado
        Swal.fire({
          title: "Cliente no encontrado",
          text: "No se encontró ningún Cliente con el NIT proporcionado.",
          icon: "error",
          timer: 3000
        });
      }
    }
  };

  //metodo para actualizar empleado
  const update = async (event) => {
    event.preventDefault();

    await axios.patch("http://localhost:3000/api/clientes/" + id, {
      id: id,
      nombre: nombre,
      direccion: direccion,
      telefono: telefono
    });
    await limpiarCampos();
    setCliente("");
      Swal.fire({
        title: "Actualizacion Exitosa!",
        html: "<i>El cliente <strong>" + nombre + "</strong>  fue Actualizado con exito </i>",
        icon: "success",
        timer: 3000

      });
  }

  //metodo para eliminar clientes
  const borrar = (cliente) => {
    Swal.fire({
      title: "confirmar?",
      text: "confirmas que quieres eliminar a " + cliente.nombre + " ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/clientes/${cliente._id}`).then(() => {
          limpiarCampos();
          setCliente("")
          Swal.fire({
            title: "Eliminado!",
            text: cliente.nombre + ' fue eliminado',
            icon: "success",
            timer: 3000
          });

        })

      }
    });

  }
  

  //metodos secundarios

  const mostrarAgregar = () => {
    setAgregar(!agregar);
  }; 

  const limpiarCampos = () => {
    setNit("");
    setNombre("");
    setDireccion("");
    setTelefono("");
    setEditar(false);
  }

  const editarCliente = (cliente) => {
    setEditar(true);

    setNit(cliente.nit);
    setNombre(cliente.nombre);
    setDireccion(cliente.direccion);
    setTelefono(cliente.telefono);
    setId(cliente._id);

  }

  return (
    <div className="container g-empleados">
      <div className="card text-center">
        <div className="card-header">
          <h1>Gestion de Clientes</h1>
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
            {agregar ? 'Agregar nuevo Cliente' : 'Buscar Cliente'}
          </label>
        </div>

        {agregar ? (
          <div className="card-body">
            <form>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">NIT</span>
                <input
                  onChange={(event) => {
                    setNit(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={nit}
                  placeholder="Ingrese NIT"
                  aria-label="nit"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Nombre</span>
                <input
                  onChange={(event) => {
                    setNombre(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={nombre}
                  placeholder="Ingrese Nombre"
                  aria-label="nombre"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Direccion</span>
                <input
                  onChange={(event) => {
                    setDireccion(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={direccion}
                  placeholder="Ingrese el cargo"
                  aria-label="direccion"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Telefono</span>
                <input
                  onChange={(event) => {
                    setTelefono(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={telefono}
                  placeholder="Ingrese el telefono"
                  aria-label="telefono"
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
                <span className="input-group-text" id="basic-addon1">NIT</span>
                <input
                  onChange={(event) => {
                    setNit(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={nit}
                  placeholder="Ingrese Documento"
                  aria-label="nit"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              {editar ? (
                 <>
                <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Nombre</span>
                <input
                  onChange={(event) => {
                    setNombre(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={nombre}
                  placeholder="Ingrese Nombre"
                  aria-label="nombre"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Direccion</span>
                <input
                  onChange={(event) => {
                    setDireccion(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={direccion}
                  placeholder="Ingrese el cargo"
                  aria-label="direccion"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Telefono</span>
                <input
                  onChange={(event) => {
                    setTelefono(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={telefono}
                  placeholder="Ingrese el telefono"
                  aria-label="telefono"
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
                <button type="button" className="btn btn-primary" onClick={buscarCliente}>
                Buscar
              </button>

                {cliente && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nit</th>
                        <th>Nombre</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{cliente.nit}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.direccion}</td>
                        <td>{cliente.telefono}</td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" className="btn btn-info" onClick={(event) => {
                              editarCliente(cliente)
                            }} >Actualizar</button>
                            <button type="button" onClick={() => {
                              borrar(cliente)
                            }} className="btn btn-danger">Eliminar</button>
                          </div>
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                )}
                </>

              )
            }

              
            </form>

            


          </div>
        )}
      </div>
    </div>
  );
}

export default Clientes;

