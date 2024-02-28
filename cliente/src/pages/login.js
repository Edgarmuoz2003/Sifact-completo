import 'bootstrap/dist/css/bootstrap.min.css'
// Importa useState desde react
import React, { useState } from 'react'; 
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'; 
import axios from 'axios';
import '../css/estilos-login.css';

const Login = ({ setAuthenticated, setToken, setNombre }) => {
  // Crear estados locales
  const history = useHistory();
  const [documento, setDocumento] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  // Método para autenticarse
  const auth = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        documento: documento,
        contrasenia: contrasenia
      });

      if (response.data.token && response.data.nombre) {
        setAuthenticated(true);
        setToken(response.data.token);
        setNombre(response.data.nombre);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('nombre', response.data.nombre);


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
                type="number" name="documento" className="form-control" id="documento" placeholder="Número de documento"/>
            </div>

            <div className="mb-3">
              <label htmlFor="contrasenia" className="form-label">Contraseña</label>
              <input
                onChange={(event) => setContrasenia(event.target.value)}
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
