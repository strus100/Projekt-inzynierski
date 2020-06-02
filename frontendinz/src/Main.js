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
  const [historyB, setHistoryB] = useState([{title: "strus100/Projekt-inzynierski", link: "http://localhost/proxy?url=https://github.com/strus100/Projekt-inzynierski"}, {title: "Projekt Inżynierski – Dysk Google", link: "http://localhost/proxy?url=https://drive.google.com/drive/folders/1OBH7hwjS7rxf_lPeMfBeXzLsXSPu-4sN"}]);
  const [ws, setWebsocket] = useState(null); 
  const [iframeURL, setIframeURL] = useState("http://wmi.amu.edu.pl"); 
  const {authenticated, setAuthenticated} = useContext(AContext);
  const {admin, setAdmin} = useContext(AContext);
  const URL = 'ws://localhost:1111';
  const proxy = 'http://localhost/proxy?url=';

  useEffect(() => {
    var timeout = 1000;
    var connectInterval;
	  var webSocket;
	
    function connect(){
      webSocket = new WebSocket(URL);
  
      webSocket.onopen = () => {
        console.log('connected');
        const message = { type: "chat", chat: `Połączono z chatem.`, name: "SERVER" }
        addMessage(message);
        if(admin){
          webSocket.send("1");
        }else{
          webSocket.send("2");
        }
        clearTimeout(connectInterval);
        setWebsocket(webSocket);
        if(admin){
          setListenerScroll();
        }
      };
  
      webSocket.onmessage = (evt) => {
        const message = evt.data;
        console.log(JSON.parse(message).type);
        switch(JSON.parse(message).type){
          case "chat": return addMessage(JSON.parse(message));
          case "event":
            var parsed = JSON.parse(message);
            var element = document.getElementById("scoreboard").contentWindow;
            element.scrollTo(parsed.x, parsed.y);
            break;
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
        if(admin && (document.getElementById("scoreboardx") != null && document.getElementById("scoreboardx").contentDocument != null && document.getElementById("scoreboardx") != undefined && document.getElementById("scoreboardx").contentDocument != undefined)){
          //removeListenerScroll();
        }
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

    function setListenerScroll(){
      if(admin){
        const scrollStop = function (callback) {
          if (!callback || typeof callback !== 'function') return;
          var isScrolling;
          document.getElementById("scoreboardx").addEventListener('load', function(event) {
            document.getElementById("scoreboardx").contentDocument.addEventListener('scroll', function(event) {
              window.clearTimeout(isScrolling);
              isScrolling = setTimeout(function() {
                callback();
              }, 66);
            }, false);
          });
        }
        scrollStop(function () {
          console.log("scroll frame5");
          const message = { type: "event", event: "scroll", x: document.getElementById("scoreboardx").contentWindow.scrollX, y: document.getElementById("scoreboardx").contentWindow.scrollY };
          if(webSocket.readyState === WebSocket.OPEN){
            webSocket.send(JSON.stringify(message));
          }
        });
      }
    }

    return () => {
      console.log("clear");
      clearInterval(connectInterval);
      if(admin && (document.getElementById("scoreboardx") != null && document.getElementById("scoreboardx").contentDocument != null && document.getElementById("scoreboardx") != undefined && document.getElementById("scoreboardx").contentDocument != undefined)){
        //removeListenerScroll();
      }
      if(webSocket){
        webSocket.close();
        setWebsocket(null);
      }
    };
  }, []);

  function removeListenerScroll(){
      var el = document.getElementById("scoreboardx");
      var clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
  }

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

  function handleChangeURL(e, url){
    e.preventDefault();
    setIframeURL(url);
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
          <Iframe
            proxy={proxy}
            iframeURL={iframeURL}
            handleChangeURL={handleChangeURL}
          />
          <Chat 
            checkedChat={checkedChat} 
            hoverChat={hoverChat} 
            ws={ws} 
            messages={messages} 
            historyB={historyB}
            submitMessage={submitMessage}
            handleChangeURL={handleChangeURL}
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