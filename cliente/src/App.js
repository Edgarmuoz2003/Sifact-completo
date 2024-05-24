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
  const [cargo, setCargo] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedNombre = localStorage.getItem('nombre');
    const storedCargo = localStorage.getItem('cargo');

    if (storedToken && storedNombre && storedCargo) {
      setToken(storedToken);
      setNombre(storedNombre);
      setCargo(storedCargo);
      setAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
        </Route>
        <Route path="/home">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} cargo={cargo} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
              <Home />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/clientes">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} cargo={cargo} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
              <Clientes nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/productos">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} cargo={cargo} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
              <Productos nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/facturacion">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} cargo={cargo} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
              <Facturacion nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/configuraciones">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} cargo={cargo} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
              <Configuraciones nombre={nombre} />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route path="/empleados">
          {authenticated ? (
            <>
              <Navbar nombre={nombre} cargo={cargo} setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} setCargo={setCargo} />
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
