import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef } from 'react';
import axios from 'axios';
import '../css/estilos-empleados.css';
import Swal from 'sweetalert2'

function Empleados({ nombre }) {
  const [agregar, setAgregar] = useState(false);
  const [documento, setDocumento] = useState("");
  const [id, setId] = useState("")
  const [name, setName] = useState("");
  const [cargo, setCargo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [empleado, setEmpleado] = useState(null)
  const [editar, setEditar] = useState(false);
  const buscarRef = useRef(null);

  const cargoUsuarioActual = localStorage.getItem('cargo');

  //metodos principales
  const add = async (event) => {
    event.preventDefault();
    if (cargoUsuarioActual === 'admin') {
        try {
            await axios.post("http://localhost:3000/api/empleado", {
                documento: documento,
                nombre: name,
                cargo: cargo,
                contrasenia: contrasenia
            });
            await limpiarCampos();
            Swal.fire({
                title: "Registro Exitoso!",
                html: "<i>El empleado <strong>" + name + "</strong> fue registrado con éxito</i>",
                icon: "success",
                timer: 3000
            });
        } catch (error) {
            console.error("Error al agregar empleado:", error);
        }
    } else {
        Swal.fire({
            title: "Permiso denegado",
            text: "No tienes permisos para registrar un nuevo empleado.",
            icon: "error",
            timer: 3000
        });
    }
};

  const handleBuscarEmpleado = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await axios.get(`http://localhost:3000/api/empleado/${documento}`);
        setEmpleado(response.data);
        limpiarCampos()
        buscarRef.current.focus();
      } catch (error) {
        console.error("Error al buscar empleado:", error);
        
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "Empleado no encontrado",
            text: "No se encontró ningún empleado con el documento proporcionado.",
            icon: "error",
            timer: 3000
          });
        }
      }

    }
    
  };

  const update = async (event) => {
    event.preventDefault();

    await axios.patch("http://localhost:3000/api/empleado/" + id, {
      id: id,
      nombre: name,
      cargo: cargo,
      documento: documento
    });
    await limpiarCampos();
    setEmpleado("");
    Swal.fire({
      title: "Actualizacion Exitosa!",
      html: "<i>El empleado <strong>" + name + "</strong>  fue Actualizado con exito </i>",
      icon: "success",
      timer: 3000

    });
  }

  const borrar = (empleado) => {
    if (cargoUsuarioActual === 'admin') {
      Swal.fire({
        title: "confirmar?",
        text: "confirmas que quieres eliminar a " + empleado.nombre + " ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:3000/api/empleado/${empleado._id}`).then(() => {
            limpiarCampos();
            setEmpleado("")
            Swal.fire({
              title: "Eliminado!",
              text: empleado.nombre + ' fue eliminado',
              icon: "success",
               timer: 3000
             });
          })
            }
      });
    } else {
        Swal.fire({
            title: "Permiso denegado",
            text: "No tienes permisos para registrar un nuevo empleado.",
            icon: "error",
            timer: 3000
        });
    }


  }
  

  const mostrarAgregar = () => {
    setAgregar(!agregar);
  }; 

  const limpiarCampos = () => {
    setDocumento("");
    setName("");
    setCargo("");
    setContrasenia("");
    setEditar(false);
  }

  const editarEmpleado = (empleado) => {
    if (cargoUsuarioActual === 'admin') {
      setEditar(true);

      setDocumento(empleado.documento);
      setCargo(empleado.cargo);
      setName(empleado.nombre)
      setId(empleado._id);
    } else {
      setEditar(false)
        Swal.fire({
            title: "Permiso denegado",
            text: "No tienes permisos para Editar un empleado.",
            icon: "error",
            timer: 3000
        });
    }
    

  }

  return (
    <div className="container g-empleados">
      <div className="card text-center">
        <div className="card-header">
          <h1>Gestion de Empleados</h1>
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
            {agregar ? 'Agregar nuevo Empleado' : 'Buscar Empleado'}
          </label>
        </div>

        {agregar ? (
          <div className="card-body">
            <form>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Documento</span>
                <input
                  onChange={(event) => {
                    setDocumento(event.target.value);
                  }}
                  type="number"
                  className="form-control"
                  value={documento}
                  placeholder="Ingrese Documento"
                  aria-label="name"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Nombre</span>
                <input
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={name}
                  placeholder="Ingrese Nombre"
                  aria-label="name"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Cargo</span>
                <select
                  onChange={(event) => {
                    setCargo(event.target.value);
                  }}
                  className="form-select"
                  value={cargo}
                  aria-label="cargo"
                  aria-describedby="basic-addon1"
                  required
                >
                  <option value="" disabled>Seleccione un cargo</option>
                  <option value="admin">admin</option>
                  <option value="Cajero">Cajero</option>
                  <option value="Vendedor">Vendedor</option>
                </select>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">Contraseña</span>
                <input
                  onChange={(event) => {
                    setContrasenia(event.target.value);
                  }}
                  type="text"
                  className="form-control"
                  value={contrasenia}
                  placeholder="Ingrese la contraseña"
                  aria-label="contraseña"
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
                <span className="input-group-text" id="basic-addon1">Documento</span>
                <input
                  onChange={(event) => {
                    setDocumento(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleBuscarEmpleado(event);
                    }
                  }}
                  type="number"
                  className="form-control"
                  value={documento}
                  placeholder="Ingrese Documento"
                  aria-label="documento"
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
                      setName(event.target.value);
                    }}
                    type="text"
                    className="form-control"
                    value={name}
                    placeholder="Ingrese Nombre"
                    aria-label="name"
                    aria-describedby="basic-addon1"
                    required
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">Cargo</span>
                  <select
                    onChange={(event) => {
                      setCargo(event.target.value);
                    }}
                    className="form-select"
                    value={cargo}
                    aria-label="cargo"
                    aria-describedby="basic-addon1"
                    required
                  >
                    <option value="" disabled>Seleccione un cargo</option>
                    <option value="admin">admin</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Vendedor">Vendedor</option>
                  </select>
                </div>
                <button type="button" className="btn btn-primary" onClick={update}>
                  Guardar Cambios
                </button>
                </>
              ) : (
                <>             

                {empleado && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Documento</th>
                        <th>Nombre</th>
                        <th>Cargo</th>
                        <th>Acciones</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{empleado.documento}</td>
                        <td>{empleado.nombre}</td>
                        <td>{empleado.cargo}</td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                            <button type="button" className="btn btn-info" onClick={(event) => {
                              editarEmpleado(empleado)
                            }} >Actualizar</button>
                            <button type="button" onClick={() => {
                              borrar(empleado)
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

export default Empleados;

