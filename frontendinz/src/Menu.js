import React from 'react';
import { Link } from "react-router-dom";
import './App.css'

function Menu(props){   
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
            </nav>
        </div>
        )
} 

export default Menu;