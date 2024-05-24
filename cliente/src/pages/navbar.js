import React, { useState } from "react";
import { Link, useHistory, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const cargoUsuarioActual = localStorage.getItem('cargo');

function Navbar({ nombre, setAuthenticated, setToken, setNombre, setCargo }) {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);

  const Logout = () => {
    // Limpiar la información del usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('cargo');

    // Restablecer los estados
    setAuthenticated(false);
    setToken("");
    setNombre("");
    setCargo("");

    // Habilitar la redirección
    setRedirect(true);
  }

  if (redirect) {
    // Redirigir a la página de inicio de sesión
    return <Redirect to="/login" />;
  }

  return (
    <div className="Home">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/facturacion">Facturación</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/clientes">Clientes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productos">Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/empleados">Empleados</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/configuraciones">Configuraciones</Link>
              </li>
            </ul>
            <div className="navbar-brand ms-auto">
              <p className="nombre"> {nombre} - {cargoUsuarioActual}</p>
            </div>
            <div className="navbar-brand ms-auto">
              <button className="btn btn-success" onClick={Logout}>Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
