import React, { useState, useMemo, useEffect } from 'react';
import Main from "./Main"
import Login from "./Login"
import {AContext} from "./AContext";
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [access, setAccess] = useState(false);
  const [name, setName] = useState(false);
  const [surname, setSurname] = useState(false);
  const [token, setToken] = useState(false);

  const providerValue = useMemo(() => ({
        authenticated, setAuthenticated,
        admin, setAdmin,
		access, setAccess,
		name, setName,
		surname, setSurname,
		token, setToken,
    }), [authenticated, admin, access, name, surname, token]);
	
    useEffect(() => {
		axios.post('/login_system/login.php', {  })
		.then(function (response) {
			if(response.data.login == 1){
				setAccess(response.data.access);
				setName(response.data.name);
				setSurname(response.data.surname);
				setToken(response.data.token);
				setAuthenticated(true);
				if(response.data.access == "pracownik" || response.data.access == "doktorant"){
					setAdmin(true);
					console.log("admin SET");
				}else{
					setAdmin(false);
				}
			}else{
				setAuthenticated(false);
			}
			setLoaded(true);
		})
		.catch(function (error) {
			console.log(error);
		});
      }, []);
	  
    return (
		<div>
		{loaded ?
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
		  :
		  <h1>Loading</h1>
		}
		</div>
    );
}

export default App;