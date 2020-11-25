import React from 'react';
import { Link } from "react-router-dom";
import '../../css/App.css'

function Menu(props){   
        var className = 'menu-activea';

        if(props.checkedMenu){
            className += ' menu-active';
        }

        if(props.hoverMenu && !props.checkedMenu){
            className += ' menu-hover';
        }

        function handleClick(e){
            //console.log("this is working fine");
            e.preventDefault();
            document.getElementById("myModal").style.display = "block";
        }

        return(
        <div className="menu">
            <nav className={className}>
                <ul>
                    {props.roomAdmin && <li onClick={(e) => handleClick(e) }><a href="#">Ustawienia</a></li>}
                    <li><Link to="/">Strona główna</Link></li>
                    <li><Link to="/faq" target="_blank">FAQ</Link></li>
                    <li><Link to="/lobby">POKOJE</Link></li>
                    <li onClick={() => props.handleLogout()}><a href="#">WYLOGUJ</a></li>
                </ul>
            </nav>
        </div>
        )
} 

export default Menu;
