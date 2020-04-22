import React, { useState } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"

function App() {
  const [checkedMenu, setChangeMenu] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);

  function handleChangeMenu(checkedMenu){
    setChangeMenu(checkedMenu => !checkedMenu);
  }

  function handleChangeChat(checkedChat){
    setChangeChat(checkedChat => !checkedChat);
  }

    return (
        <div>
          <Menu checkedMenu={checkedMenu}/>
          <Chat checkedChat={checkedChat}/>
          <Footer checkedMenu={checkedMenu} checkedChat={checkedChat} handleChangeChat={handleChangeChat} handleChangeMenu={handleChangeMenu}/>
        </div>
    );
}

export default App;