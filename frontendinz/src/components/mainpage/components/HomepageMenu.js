import React, { Children } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function HomepageMenu(props){
    return(
        <ul>
            <li>
                <a href="#section--start">Strona Główna</a>
            </li>
            <li>
                <a href="#section--onas">O nas</a>
            </li>
            <li>
                <a href="#section--2">ARCHITEKTURA</a>
            </li>
            <li>
                <Link to="/faq" target="_blank">FAQ</Link>
            </li>
            <li>
                <Link to="/login">login</Link>
            </li>
        </ul>
    )
}

export default HomepageMenu;