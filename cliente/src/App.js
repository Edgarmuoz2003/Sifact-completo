import React, { useState } from 'react'; 
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom' 
import Home from './pages/home';
import Login from './pages/login';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [nombre, setNombre] = useState('');

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login setAuthenticated={setAuthenticated} setToken={setToken} setNombre={setNombre} />
        </Route>
        <Route path="/home">
          {authenticated ? <Home nombre={nombre} /> : <Redirect to="/login" />}
        </Route>
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
