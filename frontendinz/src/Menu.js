import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import {AppContext} from "./context/AppContext"
import './App.css'

function Menu(props){   
        var className = 'menu-activea';

        if(props.checkedMenu){
            className += ' menu-active';
        }

        const {user} = useContext(AppContext);

        return(
        <div className="menu">            
            <nav className={className}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/test">Test</Link></li>
                    <li><Link to="/main">Main</Link></li>
                </ul>
                <h1>{user}</h1>
            </nav>
        </div>
        )
} 

export default Menu;