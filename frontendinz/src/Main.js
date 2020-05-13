import React, { useState, useContext } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import {AContext} from "./AContext"

function Main() {
  const [checkedMenu, setChangeMenu] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);
  const {authenticated, setAuthenticated} = useContext(AContext);

  function handleChangeMenu(checkedMenu){
    setChangeMenu(checkedMenu => !checkedMenu);
  }

  function handleChangeChat(checkedChat){
    setChangeChat(checkedChat => !checkedChat);
  }

  function handleLogout(){
    setAuthenticated(false);
    localStorage.removeItem('authenticated');
  }

  return (
      <div className="main">
          <h1>{authenticated}</h1>
          <button onClick={() => handleLogout()}>WYLOGUJ</button>
          <Menu checkedMenu={checkedMenu}/>
          <Chat checkedChat={checkedChat}/>
          <Footer checkedMenu={checkedMenu} checkedChat={checkedChat} handleChangeChat={handleChangeChat} handleChangeMenu={handleChangeMenu}/>
      </div>
  );
}

export default Main;