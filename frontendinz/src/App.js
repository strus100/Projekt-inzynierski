import React, { useState, useMemo, useEffect } from 'react';
import Main from "./Main"
import Login from "./Login"
import Lobby from "./Lobby"
import HomePage from "./HomePage"
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
  const [admin, setAdmin] = useState(true);
  const [loaded, setLoaded] = useState(true); //zmienić na false

  const [access, setAccess] = useState(false);
  const [name, setName] = useState("Dawid");
  const [surname, setSurname] = useState("Krause");
  const [login, setLogin] = useState("s434729");
  const [token, setToken] = useState(false);

  const [lightMode, setLightMode] = useState(JSON.parse(localStorage.getItem('lightMode')) || false); //experimental
  const [cookieDecision, setCookieDecision] = useState(JSON.parse(localStorage.getItem('cookies')) || false);
  const [cookieDecisionVal, setCookieDecisionVal] = useState(JSON.parse(localStorage.getItem('cookies')) ? "none" : "block" );

  const [homePageCheck, setHomePageCheck] = useState("");

  const [error, setError] = useState(false);

  const TITLE = 'Wykłady Webowe';

  const providerValue = useMemo(() => ({
        authenticated, setAuthenticated,
        admin, setAdmin,
		access, setAccess,
		name, setName,
		surname, setSurname,
		token, setToken,
		login, setLogin
	}), [authenticated, admin, access, name, surname, token, login]);
	
	useEffect(() =>{
		document.title = TITLE;
		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		  });

		window.addEventListener("hashchange", () => {
			console.log("hash changed");
		})

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
			if(response.data.login !== 0){
				setAccess(response.data.access);
				setName(response.data.name);
				setSurname(response.data.surname);
				setToken(response.data.token);
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
		/*if(cookieDecision){
			setCookieDecisionVal("none");
			setCookieDecision(true);
		}
		else{
			setCookieDecisionVal("block");
		}*/
		//console.log(cookieDecision + cookieDecisionVal);
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
		setAdmin(false);
		setAuthenticated(false);
	  }

	function testUrl(){
		console.log("detected");
	}
	  
    return (
		<div className={classApp}>
			
			<div id="simplecookienotification_v01" style={{display: cookieDecisionVal}}>
			<div>
			<span id="simplecookienotification_v01_powiadomienie">Ta strona używa plików cookies.</span><span id="br_pc_title_html"><br></br></span>
			<a id="simplecookienotification_v01_polityka" href="http://jakwylaczyccookie.pl/polityka-cookie/">Polityka Prywatności</a><span id="br_pc2_title_html"> &nbsp;&nbsp; </span>
			<a id="simplecookienotification_v01_info" href="http://jakwylaczyccookie.pl/jak-wylaczyc-pliki-cookies/">Jak wyłączyć cookies?</a><div id="jwc_hr1"></div>
			<a id="okbutton" onClick={cookieOK}>ROZUMIEM</a><div id="jwc_hr2"></div>
			</div>
			</div>
		{loaded ?
		  <Router onChange={testUrl()}>
			<AContext.Provider value={providerValue}>
			  <Switch>
				<Route exact path="/" render={() => <HomePage authenticated={authenticated} handleLogout={handleLogout}/>}/>
				<Route path="/main/:id" render={() => (authenticated ? <Main lightMode={lightMode} lightModeHandler={lightModeHandler}/> : <Redirect to='/login' />)}/>
				<Route path="/lobby" render={() => (authenticated ? <Lobby lightMode={lightMode} lightModeHandler={lightModeHandler}/> : <Redirect to='/login' />)}/>
				<Route path="/login" render={() => (!authenticated ? <Login/> : <Redirect to='/lobby' />)}/>
			  </Switch>
			</AContext.Provider>
		  </Router>
		  :
		  <div style={{margin: 0 + " auto", height: 100+"vh", lineHeight: 100+"vh", width: 100+"%"}}>
			  <div class="loader">Loading...</div>
		  	<h1 style={{textAlign: "center", margin: 0}}>{error ? "Błąd łączenia z serwerem" : "Łączenie z serwerem..."}</h1>
		  </div>
		}
		</div>
    );
}

export default App;