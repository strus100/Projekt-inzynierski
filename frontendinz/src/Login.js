import React, {useState, useEffect, useContext} from 'react';
import { AContext } from "./AContext"
import './App.css'

function Login(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [error, setError] = useState(false);
    const {setAuthenticated} = useContext(AContext);

    useEffect(() => {
        if (username.trim() && password.trim()) {
          setIsButtonDisabled(false);
        } else {
          setIsButtonDisabled(true);
        }
      }, [username, password]);

    const handleLogin = (e) => {
      e.preventDefault();
        if (username === 'admin' && password === '123') {
          setError(false);
          setAuthenticated(true);
          localStorage.setItem("authenticated", true);
        } else {
          setError(true);
          console.log("not logged")
        }
      };
    
    const handleKeyPress = e => {
        if (e.keyCode === 13 || e.which === 13) {
          isButtonDisabled || handleLogin();
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

                {error && <h1 id="error-msg">Nie udało się zalogować.</h1>}

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