import React, { useState, useMemo } from 'react';
import Main from "./Main"
import Login from "./Login"
import {AppContext} from "./context/AppContext"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

function App() {
    const [user, setUser] = useState(null);

    const value = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
      <Router>
        <AppContext.Provider value={value}>
          <Switch>
            <Route exact path="/">
              <h1>Index</h1>
            </Route>
            <Route path="/main">
              <Main/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="*">
              <h1>Not found</h1>
            </Route>
          </Switch>
        </AppContext.Provider>
      </Router>
    );
}

export default App;