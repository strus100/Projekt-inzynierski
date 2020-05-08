import React, { useContext, useEffect } from 'react';
import { AppContext } from "./context/AppContext"
import './App.css'

function Footer(props){
    const {user, setUser} = useContext(AppContext);

    return(
    <div className="footer">
        <div>        
            <input 
                type="checkbox" 
                id="tooglemenu"
                checked={ props.checkedMenu } 
                onChange={ props.handleChangeMenu } 
                onClick={console.log( props.checkedMenu )}/>    
            <label htmlFor="tooglemenu">&#9776;</label>
    
            <input 
                type="checkbox" 
                id="tooglechat"
                checked={ props.checkedChat } 
                onChange={ props.handleChangeChat } 
                onClick={console.log( props.checkedChat )}/>
            <label htmlFor="tooglechat">&#128172;</label>
        </div>
    </div>
    )
} 

export default Footer;