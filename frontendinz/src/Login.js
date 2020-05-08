import React, {useState, useEffect, useContext} from 'react';
import { AppContext } from "./context/AppContext"
import './App.css'
import { Redirect } from 'react-router-dom';

function Login(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const {user, setUser} = useContext(AppContext);

    useEffect(() => {
        if (username.trim() && password.trim()) {
          setIsButtonDisabled(false);
        } else {
          setIsButtonDisabled(true);
        }
      }, [username, password]);

    const handleLogin = () => {
        if (username === 'admin' && password === '123') {
          setError(false);
          setUser('admin');
          console.log("logged", user)
          setRedirect(true)
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

    if(user !== null){
        return <Redirect to="/main" />;
    }
    else{
        return(
        <div className="login_form">
            <h1>{user}</h1>
            <form action="">        
                <div className="form-field">
                    <label className="user" htmlFor="login-username"><span className="hidden">Username</span></label>
                    <input 
                        id="login-username" 
                        type="text" 
                        className="login--input" 
                        placeholder="Username" 
                        onChange={(e)=>setUsername(e.target.value)}
                        onKeyPress={(e)=>handleKeyPress(e)}
                        required></input>
                </div>

                <div className="form-field">
                    <label className="lock" htmlFor="login-password"><span className="hidden">Password</span></label>
                    <input 
                        id="login-password" 
                        type="password" 
                        className="login--input" 
                        placeholder="Password" 
                        onChange={(e)=>setPassword(e.target.value)}
                        onKeyPress={(e)=>handleKeyPress(e)}
                        required></input>
                </div>

                <button 
                    type="submit" 
                    className="login--button"
                    onClick={()=>handleLogin()}
                    disabled={isButtonDisabled}
                    >
                    Zaloguj
                </button>
            </form>
        </div>
        )
    }
} 

export default Login;