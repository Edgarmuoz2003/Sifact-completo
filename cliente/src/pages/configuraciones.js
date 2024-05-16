import React, { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/estilos-config.css';
import Swal from 'sweetalert2'

function Configuraciones() {

  const [vistaActual, setVistaActual] = useState("empresa")//este hook resibe un parametro que inicializa en esa vista
  const [nit, setNit] = useState("")
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState(null)
  const [mensaje1, setMensaje1] = useState("")
  const [mensaje2, setMensaje2] = useState("")
  const [resolucionNum, setResolucionNum] = useState(null)
  const [fechaRes, setFecharRes] = useState("")
  const [autoriza, setAutoriza] = useState("")
  const [numInicio, setNumInicio] = useState("")
  const [numFinal, SetNumFinal] = useState("")
  const [fechaVigencia, setFechaVigecia] = useState("")
  const [resolucion, setResolucion] = useState(null)
  const [adicional1, setAdicional1] = useState("")
  const [adicional2, setAdicional2] = useState("")
  const [adicional3, setAdicional3] = useState("")
  const [adicional4, setAdicional4] = useState("")
  const [msgAdicional, setMsgAdicional] = useState("")
  const [idMensajesLey, setIdMensajesLey] = useState("")
  

  //creamos una funcion para cambiar de vistas
  const cambiarVista = (nuevaVista) => {//al establecer este parametro (nuevaVista)asignamos a vistaActual el valor que se le pase como parametro en el switch
    setVistaActual(nuevaVista)
  }

   //METODOS REFERENTES A LA VISTA EMPRESA
  //Metodo para ver la informacion guardada de la empresa en los campos
  const verEmpresa = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/config/empresa')
      const empresaData = response.data
      setEmpresa(empresaData.data);
      setNombre(empresaData.nombre);
      setNit(empresaData.nit);
      setDireccion(empresaData.direccion)
      setTelefono(empresaData.telefono)
    } catch (error) {
      console.error("Error al obtener los datos Registrados", error);
    }
   
  }

  //metodo para guardar cambios realizados en empresa
  const updateEmpresa = async (event) => {
    event.preventDefault(); 
    try {
      await axios.put("http://localhost:3000/api/config/empresa", {
        nombre: nombre,
        nit: nit,
        direccion: direccion,
        telefono: telefono
      });
      await limpiarCampos()
      Swal.fire({
        title: "Actualizacion Exitosa!",
        html: "<i>El empresa <strong>" + nombre + "</strong>  fue Actualizada con exito </i>",
        icon: "success",
        timer: 3000

      });
    } catch (error) {
      
    }
  }

  //METODOS PARA LA VISTA RESOLUCIONES

  //mostrar los datos guardados
  const verResolucion = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/config/resolucion');
      const resolucionData = response.data[0];
      if (resolucionData) {
        setMensaje1(resolucionData.mensaje1);
        setMensaje2(resolucionData.mensaje2);
        setResolucionNum(resolucionData.resolucionNum);
        setFecharRes(resolucionData.fechaRes);
        setAutoriza(resolucionData.autoriza);
        setNumInicio(resolucionData.numInicio);
        SetNumFinal(resolucionData.numFinal);
        setFechaVigecia(resolucionData.fechaVigencia);
      }
    } catch (error) {
      console.error("Error al obtener los datos Registrados", error);
    }
  };

  //guardar cambios
  const updateResolucion = async (event) => {
    event.preventDefault(); 

    // Obtener los datos de la resolución primero
    try {
        const response = await axios.get('http://localhost:3000/api/config/resolucion');
        const resolucionData = response.data[0]; // Suponiendo que solo necesitas el primer registro
        if (!resolucionData) {
            console.error("No se encontraron datos de resolución para actualizar");
            return;
        }

        // Una vez que tienes los datos, obtienes el ID
        const id = resolucionData._id; // Suponiendo que el ID está en la propiedad _id

        // Ahora realizas la solicitud PUT para actualizar los datos usando el ID
        const updateResponse = await axios.put(`http://localhost:3000/api/config/resolucion/${id}`, {
            mensaje1: mensaje1,
            mensaje2: mensaje2,
            resolucionNum: resolucionNum,
            fechaRes: fechaRes,
            autoriza: autoriza,
            numInicio: numInicio,
            numFinal: numFinal,
            fechaVigencia: fechaVigencia 
        });

        // Limpia los campos después de una actualización exitosa
        await limpiarCamposRes();

        // Muestra un mensaje de éxito
        Swal.fire({
            title: "Actualización Exitosa!",
            html: "<i>La resolución <strong>" + resolucionNum + "</strong>  fue Actualizada con éxito </i>",
            icon: "success",
            timer: 3000
        });

    } catch (error) {
        console.error("Error al intentar actualizar los datos:", error.message);
    }
};


   //METODOS REFERENTES A LA VISTA MENSAJES ADICIONALES
  //Metodo para ver los mensajes Adicionales
  const verAdicionales = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/config/mensajes')
      setMsgAdicional(response.data);
      setAdicional1(msgAdicional.mensaje1);
      setAdicional2(msgAdicional.mensaje2);
      setAdicional3(msgAdicional.mensaje3);
      setAdicional4(msgAdicional.mensaje4);
    } catch (error) {
      console.error("Error al obtener los datos Registrados", error);
    }
   
  }

  //metodo para guardar cambios realizados en empresa
  const updateAdicionales = async (event) => {
    event.preventDefault(); 
    try {
      await axios.put("http://localhost:3000/api/config/mensajes", {
        mensaje1: adicional1,
        mensaje2: adicional2,
        mensaje3: adicional3,
        mensaje4: adicional4
      });
      await limpiarCamposAdd()
      Swal.fire({
        title: "Actualizacion Exitosa!",
        html: "<i>El empresa <strong>" + nombre + "</strong>  fue Actualizada con exito </i>",
        icon: "success",
        timer: 3000

      });
    } catch (error) {
      
    }
  }

  //metodo para limpiar los campos despues de actualizar
  const limpiarCampos = () => {
    setNombre("");
    setDireccion("");
    setNit("");
    setTelefono("");
  }

  const limpiarCamposRes = () => {
    setMensaje1("");
    setMensaje2("");
    setResolucionNum("");
    setFecharRes("");
    setAutoriza("");
    setNumInicio("");
    SetNumFinal("");
    setFechaVigecia("");
  }

  const limpiarCamposAdd = () => {
    setAdicional1("")
    setAdicional2("")
    setAdicional3("")
    setAdicional4("")
  }

  //esta funcion es la encargada de renderizar la vista correspondiente segun el valor de vistaActual
  const renderizarVista = () =>{
    switch (vistaActual){//este es el witch para cambiar de vista segun el parametro
      case "empresa":
        return <div className="container">
                  <div className="card">
                    <div className="card-header">
                      <h1>Configurar datos de la Empresa</h1>
                    </div>
                      <div className="card-body">
                    <form>
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">NIT</span>
                        <input
                          onChange={(event) => {
                            setNit(event.target.value);
                          }}
                          type="text"
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
                          type="text"
                          className="form-control"
                          value={telefono}
                          placeholder="Ingrese el telefono"
                          aria-label="telefono"
                          aria-describedby="basic-addon1"
                          required
                        />
                      </div>
                      <button type="button" className="btn btn-primary " onClick={verEmpresa}>Ver Datos Guardados</button>
                      <button type="submit" className="btn btn-success ml-2 " onClick={updateEmpresa}>Guardar Cambios</button>
                    </form>
                    </div>
                    
                  </div>
               </div>;
      case "resolucion":
        return <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>Configurar Resolusion y mensajes de Ley</h1>
          </div>
            <div className="card-body">
          <form>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">mensaje 1</span>
              <input
                onChange={(event) => {
                  setMensaje1(event.target.value);
                }}
                type="text"
                className="form-control"
                value={mensaje1}
                placeholder="ejemplo: Regimen comun"
                aria-label="mensaje1"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Mensaje 2</span>
              <input
                onChange={(event) => {
                  setMensaje2(event.target.value);
                }}
                type="text"
                className="form-control"
                value={mensaje2}
                placeholder="Ejemplo: Somos Grandes Contribuyentes"
                aria-label="mensaje2"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">numero de Resolucion</span>
              <input
                onChange={(event) => {
                  setResolucionNum(event.target.value);
                }}
                type="text"
                className="form-control"
                value={resolucionNum}
                placeholder="ejemplo: 125885898"
                aria-label="resolucionNum"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">fecha de la Resolucion</span>
              <input
                onChange={(event) => {
                  setFecharRes(event.target.value);
                }}
                type="text"
                className="form-control"
                value={fechaRes}
                placeholder="Ejemplo: 24/01/2023"
                aria-label="fechaRes"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">autoriza</span>
              <input
                onChange={(event) => {
                  setAutoriza(event.target.value);
                }}
                type="text"
                className="form-control"
                value={autoriza}
                placeholder="ejemplo: FOK2"
                aria-label="autoriza"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">numero inicial</span>
              <input
                onChange={(event) => {
                  setNumInicio(event.target.value);
                }}
                type="text"
                className="form-control"
                value={numInicio}
                placeholder="Ejemplo: 1"
                aria-label="numInicio"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Numero Final</span>
              <input
                onChange={(event) => {
                  SetNumFinal(event.target.value);
                }}
                type="text"
                className="form-control"
                value={numFinal}
                placeholder="Ejemplo: 1000000"
                aria-label="numFinal"
                aria-describedby="basic-addon1"
                required
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Fecha de Vigencia </span>
              <input
                onChange={(event) => {
                  setFechaVigecia(event.target.value);
                }}
                type="text"
                className="form-control"
                value={fechaVigencia}
                placeholder="Ejemplo: 24/01/2028"
                aria-label="fechaVigencia"
                aria-describedby="basic-addon1"
                required
              />
            </div>
            <button type="button" className="btn btn-primary " onClick={verResolucion}>Ver Datos Guardados</button>
            <button type="submit" className="btn btn-success ml-2 " onClick={updateResolucion}>Guardar Cambios</button>
          </form>
          </div>
          
        </div>
     </div>;
      case "mensajes":  return <div className="container">
                          <div className="card">
                            <div className="card-header">
                              <h1>Configurar Mensajes Adicionales</h1>
                            </div>
                              <div className="card-body">
                            <form>
                              <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">MENSAJE 1</span>
                                <input
                                  onChange={(event) => {
                                    setAdicional1(event.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  value={adicional1}
                                  placeholder="ejemplo: Garantia 2 meses"
                                  aria-label="mensaje1"
                                  aria-describedby="basic-addon1"
                                  required
                                />
                              </div>

                              <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Mensaje 2</span>
                                <input
                                  onChange={(event) => {
                                    setAdicional2(event.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  value={adicional2}
                                  placeholder="Ejemplo: No se aceptan Devoluciones"
                                  aria-label="mensaje2"
                                  aria-describedby="basic-addon1"
                                  required
                                />
                              </div>

                              <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Mensaje 3</span>
                                <input
                                  onChange={(event) => {
                                    setAdicional3(event.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  value={adicional3}
                                  placeholder="ejemplo SIN FACTURA NO SE ACEPTAN CAMBIOS"
                                  aria-label="adicional3"
                                  aria-describedby="basic-addon1"
                                  required
                                />
                              </div>

                              <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Mensaje 4</span>
                                <input
                                  onChange={(event) => {
                                    setAdicional4(event.target.value);
                                  }}
                                  type="text"
                                  className="form-control"
                                  value={adicional4}
                                  placeholder="Ejemplo: Gracias por su compra"
                                  aria-label="adicional4"
                                  aria-describedby="basic-addon1"
                                  required
                                />
                              </div>
                              <button type="button" className="btn btn-primary " onClick={verAdicionales}>Ver Datos Guardados</button>
                              <button type="submit" className="btn btn-success ml-2 " onClick={updateAdicionales}>Guardar Cambios</button>
                            </form>
                            </div>
                            
                          </div>
                      </div>;
        
      default:
        return null;
    }
  };

  //ahora se llama desde cada boton al metodo cambiarVista y se le pasa como parametro el valor correspondiente
 
  return (
    <div className="container text-center config">
      <div className="card">
        <div className="card-header">
          <h1>Configuraciones</h1>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-3 border">
              <div className="config-button">
                <button className="btn btn-info" onClick={() => cambiarVista("empresa")}>Empresa</button>
              </div>
              <div className="config-button">
                <button className="btn btn-info" onClick={() => cambiarVista("resolucion")}>Resolucion</button>
              </div>
              <div className="config-button">
                <button className="btn btn-info" onClick={() => cambiarVista("mensajes")}>Mensajes Adicionales</button>
              </div>
            </div>
            
            <div className="col-9 border">  
            {renderizarVista()}   {/* aqui hacemos el llamado a la funcion que me mostrara la vista segun corresponda */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Configuraciones;