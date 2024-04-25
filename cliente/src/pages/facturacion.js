import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//import '../css/estilos-facturacion.css';

function Facturacion({ nombre }) {
  //aqui se definen todas las constantes que se usaran en la interfaz de facturacion
  const [fecha, setFecha] = useState("");
  const [autoriza, setAutoriza] = useState("");
  const [numInicio, setNumInicio] = useState();
  const [numActual, setNumActual] = useState("");

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
        const response = await axios.get("http://localhost:3000/api/config/numActual");
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

  //esta funcion se encarga de que la funcion obtener fecha se ejecute y muestre
  //la fecha apenas se renderice la pagina
  useEffect(() => {
    obtenerFecha();
    mostrarNumeroActual();
  }, []);

  return (
    <div className="container principal">
      <h1>Facturación</h1>
      <section className="seccion-datosfac">
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
    </div>
  );
}

export default Facturacion;
