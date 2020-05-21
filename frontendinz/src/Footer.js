import React from 'react';
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
            <label htmlFor="tooglemenu"><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">&#9776;</span></label>
    
            <input 
                type="checkbox" 
                id="tooglechat"
                checked={ props.checkedChat } 
                onChange={ props.handleChangeChat } 
                />
            <label htmlFor="tooglechat"><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">&#128172;</span></label>
        </div>
        
    </div>
    )
} 

export default Footer;