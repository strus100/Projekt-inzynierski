import React, {useState, useEffect, useContext} from 'react';
import { AContext } from "./AContext"
import './App.css'
import axios from 'axios';

function Login(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [error, setError] = useState(false);
    const {setAuthenticated} = useContext(AContext);
    const {setAdmin} = useContext(AContext);
	
    const {setAccess} = useContext(AContext);
    const {setName} = useContext(AContext);
    const {setSurname} = useContext(AContext);
    const {setToken} = useContext(AContext);
	  //const {setLoaded} = useContext(AContext);

    useEffect(() => {
        if (username.trim() && password.trim()) {
          setIsButtonDisabled(false);
        } else {
          setIsButtonDisabled(true);
        }
      }, [username, password]);

    const handleLogin = e => {
      e.preventDefault();
		axios.post('/login_system/login.php', {
			login: username,
			pwd: password
		  })
		  .then(function (response) {
			if(response.data.login !== 0){
				setAccess(response.data.access);
				setName(response.data.name);
				setSurname(response.data.surname);
				setToken(response.data.token);
				setAuthenticated(true);
				if(response.data.access === "pracownik" || response.data.access === "doktorant"){
					setAdmin(true);
				}else{
					setAdmin(false);
				}
				//setLoaded(true);
			}else{
        setAuthenticated(false);
        setError(true);
			}
		  })
		  .catch(function (error) {
        setError(true);
        console.log(error);
		  });
      };
    
    const handleKeyPress = e => {
        if (e.keyCode === 13 || e.which === 13) {
          isButtonDisabled || handleLogin(e);
        }
      };

      return(
        <div className="login_form">
          <div className="form-div">
            <h1>Zaloguj się</h1>
            <form>        
                <div className="form-field">
                    <label className="user" htmlFor="login-username"><span className="hidden">Login LDAP</span></label>
                    <input 
                        id="login-username" 
                        type="text" 
                        className="login--input" 
                        placeholder="" 
                        onChange={(e)=>setUsername(e.target.value)}
                        onKeyPress={(e)=>handleKeyPress(e)}
                        required></input>
                </div>

                <div className="form-field">
                    <label className="lock" htmlFor="login-password"><span className="hidden">Hasło LDAP</span></label>
                    <input 
                        id="login-password" 
                        type="password" 
                        className="login--input" 
                        placeholder="" 
                        onChange={(e)=>setPassword(e.target.value)}
                        onKeyPress={(e)=>handleKeyPress(e)}
                        required></input>
                </div>

                <h1 id="error-msg">{error ? "Błąd logowania." : <span style={{color: "white", userSelect: "none"}}>.</span>}</h1>

                <button 
                    type="submit" 
                    className="login--button"
                    onClick={(e)=>handleLogin(e)}
                    disabled={isButtonDisabled}
                    >
                    Zaloguj
                </button>
            </form>
          </div>
        </div>
      )
} 

export default Login;
