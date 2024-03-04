import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Navbar from './pages/navbar';
import Clientes from './pages/clientes';
import Productos from './pages/productos';
import Facturacion from './pages/facturacion';
import Configuraciones from './pages/configuraciones';
import Empleados from './pages/empleados';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    // Verifica si hay un token almacenado en localStorage al cargar la aplicación
    const storedToken = localStorage.getItem('token');
    const storedNombre = localStorage.getItem('nombre');

    if (storedToken && storedNombre) {
      setToken(storedToken);
      setNombre(storedNombre);
      setAuthenticated(true);
    }
  }, []); // El segundo argumento [] asegura que este efecto se ejecute solo una vez al cargar la aplicación

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
        </Route>

        <Route path="/home">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
              <Home />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/clientes">
          <>
            <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
            <Clientes nombre={nombre} />
          </>
        </Route>

        <Route path="/productos">
          <>
            <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
            <Productos nombre={nombre} />
          </>
        </Route>

        <Route path="/facturacion">
          <>
            <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
            <Facturacion nombre={nombre} />
          </>
        </Route>

        <Route path="/configuraciones">
          <>
            <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
            <Configuraciones nombre={nombre} />
          </>
        </Route>

        <Route path="/empleados">
          <>
            <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
            <Empleados nombre={nombre} />
          </>
        </Route>

        <Redirect exact from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;

