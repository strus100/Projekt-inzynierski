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

        function handleClickFiles(e){
            //console.log("this is working fine");
            e.preventDefault();
            document.getElementById("myModalFiles").style.display = "flex";
        }

        function handleClickSettings(e){
            //console.log("this is working fine");
            e.preventDefault();
            document.getElementById("myModalSettings").style.display = "flex";
        }

        function handleClickAttendanceList(e){
            //console.log("this is working fine");
            e.preventDefault();
            document.getElementById("myModalAL").style.display = "flex";
        }

        return(
        <div className="menu">
            <nav className={className}>
                <ul>
                    {props.roomAdmin && <li onClick={(e) => handleClickSettings(e) }><a href="#">Ustawienia</a></li>}
                    {props.roomAdmin && <li onClick={(e) => handleClickFiles(e) }><a href="#">Pliki</a></li>}
                    {props.roomAdmin && <li onClick={(e) => handleClickAttendanceList(e) }><a href="#">Lista obecności</a></li>}
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
