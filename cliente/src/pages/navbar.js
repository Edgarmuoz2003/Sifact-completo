import React, { useState } from "react";
import { Link, useHistory, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function Navbar({ nombre, setAuthenticated, setToken, setNombre }) {
  const history = useHistory();
  const [redirect, setRedirect] = useState(false);

  const Logout = () => {
    // Limpia el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');

    // Restablece los estados
    setAuthenticated(false);
    setToken("");
    setNombre("");

    // Habilita la redirección
    setRedirect(true);
  }

  if (redirect) {
    // Redirige a la página de inicio de sesión
    return <Redirect to="/login" />;
  }


  return (
    <div className="Home">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/facturacion">Facturacion</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/clientes">Clientes</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/productos">Productos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/empleados">Empleados</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/configuraciones">Configuraciones</a>
              </li>
            </ul>
            <div className="navbar-brand ms-auto ">
              <p className="nombre">Bienvenido {nombre}</p>
            </div>
            <div className="navbar-brand ms-auto ">
              <button className="btn btn-success" onClick={ Logout } >Cerrar Sesion</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

  