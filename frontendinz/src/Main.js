import React, { useState, useContext } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import {AppContext} from "./context/AppContext"
import { Redirect } from 'react-router-dom';

function Main() {
  const [checkedMenu, setChangeMenu] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);
  const {user} = useContext(AppContext);

  function handleChangeMenu(checkedMenu){
    setChangeMenu(checkedMenu => !checkedMenu);
  }

  function handleChangeChat(checkedChat){
    setChangeChat(checkedChat => !checkedChat);
  }

  if(user !== null){
    return (
        <div className="main">
            <h1>{user}</h1>
            <Menu checkedMenu={checkedMenu}/>
            <Chat checkedChat={checkedChat}/>
            <Footer checkedMenu={checkedMenu} checkedChat={checkedChat} handleChangeChat={handleChangeChat} handleChangeMenu={handleChangeMenu}/>
        </div>
    );
  }
  else{
    return <Redirect to="/login" />;
  }
}

export default Main;