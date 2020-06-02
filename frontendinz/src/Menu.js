import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import {AContext} from "./AContext"
import './App.css'

function Menu(props){   
        const {admin} = useContext(AContext);

        var className = 'menu-activea';

        if(props.checkedMenu){
            className += ' menu-active';
        }

        if(props.hoverMenu && !props.checkedMenu){
            className += ' menu-hover';
        }

        return(
        <div className="menu">            
            <nav className={className}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/test">Test</Link></li>
                    <li><Link to="/main">Main</Link></li>
                </ul>
                <button onClick={() => props.handleLogout()}>WYLOGUJ</button>
                { admin ? <h1>admin</h1> : <h1>nie</h1> }
            </nav>
        </div>
        )
} 

export default Menu;