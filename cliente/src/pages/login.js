import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../css/estilos-login.css';

const Login = ({ setAuthenticated, setToken, setNombre, setCargo }) => {
  const history = useHistory();
  const [documento, setDocumento] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  
  // Referencias a los campos de documento y contraseña
  const contraseniaRef = useRef(null);

  // Manejar el evento de presionar Enter en el campo de documento
  const handleDocumentoKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evitar que el formulario se envíe
      contraseniaRef.current.focus(); // Pasar el foco al campo de contraseña
    }
  };

  // Manejar el evento de presionar Enter en el campo de contraseña
  const handleContraseniaKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evitar que el formulario se envíe
      auth(); // Ejecutar la función de autenticación
    }
  };

  // Método para autenticarse
  const auth = async () => {
    try {
        const response = await axios.post("http://localhost:3000/api/login", {
            documento: documento,
            contrasenia: contrasenia
        });

        if (response.data.token && response.data.nombre && response.data.cargo) {
          setAuthenticated(true);
          setToken(response.data.token);
          setNombre(response.data.nombre);
          setCargo(response.data.cargo);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('nombre', response.data.nombre);
          localStorage.setItem('cargo', response.data.cargo); 
  
          history.push('/home');
        } else {
          setError('Credenciales incorrectas');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Credenciales incorrectas');
        } else {
          setError('Error al autenticar. Por favor, inténtalo de nuevo.');
        }
      }
};


  return (
    <div className="container contenedor-login">
      <div className="card text-center">
        <div className="card-header">Iniciar sesión</div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label htmlFor="documento" className="form-label">Nro de Documento</label>
              <input
                onChange={(event) => setDocumento(event.target.value)}
                onKeyPress={handleDocumentoKeyPress} // Manejar el evento de presionar Enter
                type="number" name="documento" className="form-control" id="documento" placeholder="Número de documento"/>
            </div>

            <div className="mb-3">
              <label htmlFor="contrasenia" className="form-label">Contraseña</label>
              <input
                onChange={(event) => setContrasenia(event.target.value)}
                onKeyPress={handleContraseniaKeyPress} // Manejar el evento de presionar Enter
                ref={contraseniaRef} // Referencia al campo de contraseña
                type="password" name="contrasenia" className="form-control" id="contrasenia" placeholder="Ingrese su contraseña"/>
            </div>
          </form>
        </div>
        <div className="card-footer text-body-secondary">
          <button className="btn btn-success" onClick={auth}>Ingresar</button> 
        </div>
        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
