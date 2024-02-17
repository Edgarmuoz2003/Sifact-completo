import 'bootstrap/dist/css/bootstrap.min.css'
// Importa useState desde react
import React, { useState } from 'react'; 
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'; 
import axios from 'axios';

const Login = ({ setAuthenticated, setToken, setNombre }) => {
  // Crear estados locales
  const history = useHistory();
  const [documento, setDocumento] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  // Método para autenticarse
  const auth = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        documento: documento,
        contrasenia: contrasenia
      });

      // Extraer token y nombre de la respuesta
      const { token, nombre } = response.data;

      // Actualizar estados pasados como propiedades
      setAuthenticated(true);
      setToken(token);
      setNombre(nombre);

      // Redirigir a la página de inicio
      history.push('/home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
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
      </div>
    </div>
  );
};

export default Login;
