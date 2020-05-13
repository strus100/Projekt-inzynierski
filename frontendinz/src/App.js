import React, { useState, useMemo, useContext } from 'react';
import Main from "./Main"
import Login from "./Login"
import {AContext} from "./AContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

function App() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") || false);

  const value = useMemo(() => ({ authenticated, setAuthenticated }), [authenticated, setAuthenticated]);

    return (
      
      <Router>
        <AContext.Provider value={value}>
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