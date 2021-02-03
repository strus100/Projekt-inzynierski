import React, { useState, useMemo, useEffect } from 'react';
import Main from "./components/room/Main";
import Login from "./components/login/Login";
import Lobby from "./components/lobby/Lobby";
import FAQ from "./components/faq/FAQ";
import HomePage from "./components/mainpage/HomePage";
import Cookie from "./components/other/Cookie";
import Loader from "./components/other/Loader";
import {AContext} from "./context/AContext";
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const [authenticated, setAuthenticated] = useState(false); //zmienić na false
  const [admin, setAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false); //zmienić na false

  const [access, setAccess] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [login, setLogin] = useState("");
  const [token, setToken] = useState(false);
  const [roomToken, setRoomToken] = useState("");
  const [userToken, setUserToken] = useState("");

  const [lightMode, setLightMode] = useState(JSON.parse(localStorage.getItem('lightMode')) || false); //experimental
  const [cookieDecision, setCookieDecision] = useState(JSON.parse(localStorage.getItem('cookies')) || false);
  const [cookieDecisionVal, setCookieDecisionVal] = useState(JSON.parse(localStorage.getItem('cookies')) ? "none" : "block" );

  const [error, setError] = useState(false);

  const TITLE = 'Wykłady Webowe';

  const providerValue = useMemo(() => ({
        authenticated, setAuthenticated,
        admin, setAdmin,
		access, setAccess,
		name, setName,
		surname, setSurname,
		token, setToken,
		roomToken, setRoomToken,
		userToken, setUserToken,
		login, setLogin
  }), [authenticated, admin, access, name, surname, token, login, roomToken, userToken]);
	
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
			if(response.data){
				if(response.data.login !== 0){
					setAccess(response.data.access);
					setName(response.data.name);
					setSurname(response.data.surname);
					setToken(response.data.token);
					setRoomToken(response.data.roomToken);
					setUserToken(response.data.userToken);
					setLogin(response.data.login);

					setAuthenticated(true);
					if(response.data.access === "pracownik" || response.data.access === "doktorant"){
						setAdmin(true);
						//console.log("admin SET");
					}else{
						setAdmin(false);
					}
				}else{
					setAuthenticated(false);
				}
				if(response)
				setLoaded(true);
			}
		})
		.catch(function (error) {
			console.log(error);
			setError(true);
		});
	  }, []);

	  useEffect(() => {
			localStorage.setItem('lightMode', lightMode);
	  }, [lightMode]);

	  useEffect(() => {
		localStorage.setItem('cookies', cookieDecision);
	  }, [cookieDecision]);
	  	  
	var classApp = "appdiv";
	if(lightMode){
		classApp += " light-mode";
	}

	function lightModeHandler(){
		if(lightMode){
			setLightMode(false);
		}else{
			setLightMode(true);
		}
	}

	function cookieOK(){
		setCookieDecision(true);
		setCookieDecisionVal("none");
	}

	function handleLogout(){
		axios.get('/login_system/login.php?logout', {  })
			.then(function (response) {
			})
			.catch(function (error) {
				console.log(error);
			});
		setAccess(false);
		setName(false);
		setSurname(false);
		setToken(false);
		setUserToken(false);
		setRoomToken(false);
		setAdmin(false);
		setAuthenticated(false);
	  }
  
    return (
		<div className={classApp}>
			<Cookie cookieOK={cookieOK} cookieDecisionVal={cookieDecisionVal}/>
			
		{loaded ?
		  <Router>
			<AContext.Provider value={providerValue}>
				<Switch>
					<Route exact path="/" render={() => <HomePage authenticated={authenticated} handleLogout={handleLogout}/>}/>
					<Route path="/room/:id" render={() => (authenticated ? <Main lightMode={lightMode} lightModeHandler={lightModeHandler}/> : <Redirect to='/login' />)}/>

					<Route path="/lobby" render={() => (authenticated ? <Lobby lightMode={lightMode} lightModeHandler={lightModeHandler}/> : <Redirect to='/login' />)}/>
					<Route path="/login" render={() => (!authenticated ? <Login/> : <Redirect to='/lobby' />)}/>
					<Route path="/faq" render={() => <FAQ/>}/>
				</Switch>
			</AContext.Provider>
		  </Router>
		  :
		  <Loader error={error}/>
		}
		</div>
    );
}

export default App;