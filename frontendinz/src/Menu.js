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
                    <li><Link to="/main">Home</Link></li>
                    <li onClick={() => props.handleLogout()}><a href="#">WYLOGUJ</a></li>
                </ul>
            </nav>
        </div>
        )
} 

export default Menu;