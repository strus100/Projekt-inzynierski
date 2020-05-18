import React, { useContext, useEffect } from 'react';
import './App.css'

function Footer(props){
    return(
    <div className="footer">
        <div>        
            <input 
                type="checkbox" 
                id="tooglemenu"
                checked={ props.checkedMenu } 
                onChange={ props.handleChangeMenu } 
                />    
            <label htmlFor="tooglemenu">&#9776;</label>
    
            <input 
                type="checkbox" 
                id="tooglechat"
                checked={ props.checkedChat } 
                onChange={ props.handleChangeChat } 
                />
            <label htmlFor="tooglechat">&#128172;</label>
        </div>
        
    </div>
    )
} 

export default Footer;