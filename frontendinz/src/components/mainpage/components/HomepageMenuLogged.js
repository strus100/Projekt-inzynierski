import React, { Children } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function HomepageMenuLogged(props){
    return(
        <ul>
              <li>
                <a href="#section--start">Strona Główna</a>
              </li>
              <li>
                <a href="#section--onas">O projekcie</a>
              </li>
              <li>
                <a href="#section--2">Architektura</a>
              </li>
              <li>
                <Link to="/lobby" className="homepage--menu-a-pokoje">Pokoje</Link>
              </li>
              <li>
                <Link to="/faq" target="_blank">FAQ</Link>
              </li>
              <li>
                <a onClick={() => props.logout()}>Wyloguj</a>
              </li>
            </ul>
    )
}

export default HomepageMenuLogged;