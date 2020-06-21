import React, { useEffect } from 'react';
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

        function handleClick(e){
            console.log("this is working fine");
            e.preventDefault();
            document.getElementById("myModal").style.display = "block";
        }

        return(
        <div className="menu">
            <nav className={className}>
                <ul>
                    <li onClick={(e) => handleClick(e) }><a href="#">Ustawienia</a></li>
                    <li><Link to="/lobby">Lobby</Link></li>
                    <li onClick={() => props.handleLogout()}><a href="#">WYLOGUJ</a></li>
                </ul>
            </nav>
        </div>
        )
} 

export default Menu;
