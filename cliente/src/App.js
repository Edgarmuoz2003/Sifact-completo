import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
    const storedToken = localStorage.getItem('token');
    const storedNombre = localStorage.getItem('nombre');

    if (storedToken && storedNombre) {
      setToken(storedToken);
      setNombre(storedNombre);
      setAuthenticated(true);
    }
  }, []);

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
          {authenticated ? (
            <>
              <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
              <Clientes nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/productos">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
              <Productos nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/facturacion">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
              <Facturacion nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/configuraciones">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
              <Configuraciones nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/empleados">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
              <Empleados nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Redirect exact from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
