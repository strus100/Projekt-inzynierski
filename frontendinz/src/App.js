import React, { useState, useMemo } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
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
  const [checkedMenu, setChangeMenu] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);

  const [user, setUser] = useState("context var");

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  function handleChangeMenu(checkedMenu){
    setChangeMenu(checkedMenu => !checkedMenu);
  }

  function handleChangeChat(checkedChat){
    setChangeChat(checkedChat => !checkedChat);
  }

    return (
      <Router>
        <AppContext.Provider value={value}>
          <Menu checkedMenu={checkedMenu}/>
          <Switch>
            <Route exact path="/">
              <h1>Index</h1>
            </Route>
            <Route path="/main">
              <h1>Main</h1>
            </Route>
            <Route path="/test">
              <h1>test</h1>
            </Route>
            <Route path="*">
              <h1>Not found</h1>
            </Route>
          </Switch>
          <Chat checkedChat={checkedChat}/>
          <Footer checkedMenu={checkedMenu} checkedChat={checkedChat} handleChangeChat={handleChangeChat} handleChangeMenu={handleChangeMenu}/>
        </AppContext.Provider>
      </Router>
    );
}

export default App;