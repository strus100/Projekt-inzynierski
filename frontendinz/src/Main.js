import React, { useState, useContext, useEffect } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import Iframe from "./Iframe"
import {AContext} from "./AContext"

function Main() {
  const [checkedMenu, setChangeMenu] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);
  const [messages, setMesseges] = useState([]);
  const [ws, setWebsocket] = useState(null); 
  const {authenticated, setAuthenticated} = useContext(AContext);
  const {admin, setAdmin} = useContext(AContext);
  const URL = 'ws://localhost:1111';

  useEffect(() => {
    var timeout = 1000;
    var connectInterval;

    function connect(){
      var webSocket = new WebSocket(URL);
      setWebsocket(webSocket);
  
      webSocket.onopen = () => {
        console.log('connected');
        webSocket.send("1");
        clearTimeout(connectInterval);
      };
  
      webSocket.onmessage = (evt) => {
        const message = evt.data;
        console.log(JSON.parse(message).type);
        switch(JSON.parse(message).type){
          case "chat": return addMessage(JSON.parse(message));
        }
        
      };
  
      webSocket.onclose = e => {
        console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
              10000 / 1000,
              (timeout + timeout) / 1000
          )} second.`,
          e.reason
      );
  
        timeout = timeout + timeout;
        connectInterval = setTimeout(check, Math.min(10000, timeout));
        
      };
  
      webSocket.onerror = (err) => {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );
  
        webSocket.close();
      };
  
      return () => {
        webSocket.close();
      };
    }

    function check(){
      if (!ws || ws.readyState === WebSocket.CLOSED) connect();
    };

    connect();

    return () => {
      clearInterval(connectInterval);
    };
  }, []);

  function addMessage(message){
      setMesseges(x => [message, ...x] );
  }

  function submitMessage(messageString){
    if( ws != null ){
      if( ws.readyState === 1 ){
        if( messageString !== ""){
          const message = { type: "chat", chat: messageString, name: "test" }
          ws.send(JSON.stringify(message))
          addMessage(message)
        }
      }
      else{
        addMessage({ type: "chat", chat: "Nie połączono z chatem", name: "SERVER" })
      }
    }
    else{
      addMessage({ type: "chat", chat: "Nie połączono z chatem", name: "SERVER"  })
    }
  }

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
          { admin ? <h1>admin</h1> : <h1>nie</h1> }
          <button onClick={() => handleLogout()}>WYLOGUJ</button>
          <button onClick={() => setAdmin(!admin)}>Admin</button>
          <Menu checkedMenu={checkedMenu}/>
          <Iframe/>
          <Chat checkedChat={checkedChat} ws={ws} messages={messages} submitMessage={submitMessage}/>
          <Footer checkedMenu={checkedMenu} checkedChat={checkedChat} handleChangeChat={handleChangeChat} handleChangeMenu={handleChangeMenu}/>
      </div>
  );
}

export default Main;