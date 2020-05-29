import React, { useState, useContext, useEffect } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import Iframe from "./Iframe"
import {AContext} from "./AContext"

function Main() {
  const [hoverMenu, setHoverMenu] = useState(false);
  const [checkedMenu, setChangeMenu] = useState(false);
  const [hoverChat, setHoverChat] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);
  const [messages, setMesseges] = useState([]);
  const [historyB, setHistoryB] = useState([{title: "strus100/Projekt-inzynierski", link: "https://github.com/strus100/Projekt-inzynierski"}, {title: "Projekt Inżynierski – Dysk Google", link: "https://drive.google.com/drive/folders/1OBH7hwjS7rxf_lPeMfBeXzLsXSPu-4sN"}]);
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
        const message = { type: "chat", chat: `Połączono z chatem.`, name: "SERVER" }
        addMessage(message);
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
        const message = { type: "chat", chat: `Nie połączono z chatem, ponowna próba połączenia za ${Math.min(10000 / 1000, (timeout + timeout) / 1000)} sekund.`, name: "SERVER" }
        addMessage(message);
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

  function handleHoverChat(x){
    setHoverChat(x);
  }

  function handleHoverMenu(x){
    setHoverMenu(x);
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
          <Menu 
            checkedMenu={checkedMenu} 
            hoverMenu={hoverMenu}
            />
          <Iframe/>
          <Chat 
            checkedChat={checkedChat} 
            hoverChat={hoverChat} 
            ws={ws} 
            messages={messages} 
            historyB={historyB}
            submitMessage={submitMessage}
            />
          <Footer 
            checkedMenu={checkedMenu} 
            checkedChat={checkedChat} 
            handleChangeChat={handleChangeChat} 
            handleChangeMenu={handleChangeMenu} 
            handleHoverChat={handleHoverChat}
            handleHoverMenu={handleHoverMenu}
            />
      </div>
  );
}

export default Main;