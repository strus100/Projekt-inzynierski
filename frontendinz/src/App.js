import React, { useState, useMemo } from 'react';
import Main from "./Main"
import Login from "./Login"
import {AContext} from "./AContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") || false);
  const [admin, setAdmin] = useState(true);

  const providerValue = useMemo(() => ({
        authenticated, setAuthenticated,
        admin, setAdmin,
    }), [authenticated, admin]);

    return (
      
      <Router>
        <AContext.Provider value={providerValue}>
          <Switch>
            <Route exact path="/">
              <Redirect to='/login' />
            </Route>
            <Route path="/main" render={() => (authenticated ? <Main/> : <Redirect to='/login' />)}></Route>
            <Route path="/login" render={() => (!authenticated ? <Login/> : <Redirect to='/main' />)}></Route>
            <Route path="*">
              <h1>Not found</h1>
            </Route>
          </Switch>
        </AContext.Provider>
      </Router>
      
    );
}

export default App;