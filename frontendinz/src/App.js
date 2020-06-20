import React, { useState, useMemo, useEffect } from 'react';
import Main from "./Main"
import Login from "./Login"
import Lobby from "./Lobby"
import {AContext} from "./AContext";
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const [authenticated, setAuthenticated] = useState(true); //zmienić na false
  const [admin, setAdmin] = useState(false);
  const [loaded, setLoaded] = useState(true); //zmienić na false

  const [access, setAccess] = useState(false);
  const [name, setName] = useState("Imię");
  const [surname, setSurname] = useState("Nazwisko");
  const [token, setToken] = useState(false);

  const TITLE = 'Wykłady Webowe'

  const providerValue = useMemo(() => ({
        authenticated, setAuthenticated,
        admin, setAdmin,
		access, setAccess,
		name, setName,
		surname, setSurname,
		token, setToken,
	}), [authenticated, admin, access, name, surname, token]);
	
	useEffect(() =>{
		document.title = TITLE;
		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		  });

		  return () => {
			window.removeEventListener('resize', () => {
				let vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', `${vh}px`);
			  });
		};
	}, [])
	
    useEffect(() => {
		axios.post('/login_system/login.php', {  })
		.then(function (response) {
			if(response.data.login === 1){
				setAccess(response.data.access);
				setName(response.data.name);
				setSurname(response.data.surname);
				setToken(response.data.token);
				setAuthenticated(true);
				if(response.data.access === "pracownik" || response.data.access === "doktorant"){
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
		<div className="appdiv">
		{loaded ?
		  <Router>
			<AContext.Provider value={providerValue}>
			  <Switch>
				<Route exact path="/">
				  <Redirect to='/login' />
				</Route>
				<Route path="/main/:id" render={() => (authenticated ? <Main/> : <Redirect to='/login' />)}></Route>
				<Route path="/lobby" render={() => (authenticated ? <Lobby/> : <Redirect to='/login' />)}></Route>
				<Route path="/login" render={() => (!authenticated ? <Login/> : <Redirect to='/lobby' />)}></Route>
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