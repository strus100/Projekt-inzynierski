import React, { useState, useContext, useEffect } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import Iframe from "./Iframe"
import IframeInputAdmin from "./IframeInputAdmin"
import {AContext} from "./AContext"
import axios from 'axios';

function Main(props) {
  const [hoverMenu, setHoverMenu] = useState(false);
  const [checkedMenu, setChangeMenu] = useState(false);
  const [hoverChat, setHoverChat] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);
  const [checkedIframeInputAdmin, setCheckedIframeInputAdmin] = useState(false);
  const [messages, setMesseges] = useState([]);
  const [historyB, setHistoryB] = useState([{title: "strus100/Projekt-inzynierski", link: "https://github.com/strus100/Projekt-inzynierski"}, {title: "Projekt Inżynierski – Dysk Google", link: "https://drive.google.com/drive/folders/1OBH7hwjS7rxf_lPeMfBeXzLsXSPu-4sN"}]);
  const [ws, setWebsocket] = useState(null); 
  const [iframeURL, setIframeURL] = useState("http://wmi.amu.edu.pl"); 
  const {authenticated, setAuthenticated} = useContext(AContext);
  const {admin, setAdmin} = useContext(AContext);
  
  const {login, setLogin} = useContext(AContext);
  const {name, setName} = useContext(AContext);
  const {surname, setSurname} = useContext(AContext);
  const {access, setAccess} = useContext(AContext);
  const {token, setToken} = useContext(AContext);
  
  const [iframeURLadmin, setIframeURLadmin] = useState("http://wmi.amu.edu.pl"); 
  const URL = 'ws://localhost:1111';
  const proxy = 'http://localhost/proxy/index.php?url=';

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
		webSocket.send(token);
		clearTimeout(connectInterval);
		setWebsocket(webSocket);
		if(admin){
		  setListeners();
		  console.log("admin");
		}
	  };
  
	  webSocket.onmessage = (evt) => {
		const message = evt.data;
		console.log(JSON.parse(message).type);
		switch(JSON.parse(message).type){
		  case "chat": return addMessage(JSON.parse(message));
		  case "event":
			var element = document.getElementById("scoreboard").contentWindow;
			var parsed = JSON.parse(message);
			switch(parsed.event){
				case "scroll":
					element.scrollTo(parsed.x, parsed.y);
				break;
				case "redirection":
					handleChangeURL(evt, parsed.url);
				break;
			}
			
			
			
			break;
		}
	  };
  
	  webSocket.onclose = e => {
		if(window.location.href.indexOf("main") > -1){
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
	  if ((!ws || ws.readyState === WebSocket.CLOSED) && (window.location.href.indexOf("main") > -1)) {
		connect();
	  }
	};

	console.log('trying to connect');
	connect();

	function setListeners(){
		setListenerScroll();
		setListenerRedirection();
	}

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
	
	function setListenerRedirection(){
		if(admin){
			document.getElementById("scoreboardx").addEventListener('load', function(event) {
				var address =  this.contentWindow.location.href;
				var replaced;
				if(address.includes(proxy)){
					replaced = address.replace(proxy, "");
				}
				else{
					replaced = address.replace("index.php?q", "index.php?url");
					replaced = replaced.replace(proxy, "");
				}
				
				const message = { type: "event", event: "redirection", url: replaced };
				if(webSocket.readyState === WebSocket.OPEN){
					webSocket.send(JSON.stringify(message));
					setIframeURLadmin(replaced);
				}
				//console.log("frame9: "+ this.contentWindow.location.href);
			})
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
          const message = { type: "chat", chat: messageString, name: name }
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

  function handleChangeIframeInputAdmin(checkedIframeInputAdmin){
    setCheckedIframeInputAdmin(checkedIframeInputAdmin => !checkedIframeInputAdmin);
  }

  function handleHoverChat(x){
    setHoverChat(x);
  }

  function handleHoverMenu(x){
    setHoverMenu(x);
  }

  function handleLogout(){
	axios.get('/login_system/login.php?logout', {  })
		.then(function (response) {
		})
		.catch(function (error) {
			console.log(error);
		});
	setAccess(false);
	setName(false);
	setSurname(false);
	setToken(false);
	setAdmin(false);
	setAuthenticated(false);
  }

  function handleChangeURL(e, url){
    e.preventDefault();
    setIframeURL(url);
	document.getElementById("scoreboardx").contentDocument.location.reload(true);
  }

  return (
      <div className="main">
          <IframeInputAdmin
            checkedIframeInputAdmin={checkedIframeInputAdmin}
            iframeURL={iframeURL}
            handleChangeURL={handleChangeURL}
          />
          
          <Menu 
            checkedMenu={checkedMenu} 
            hoverMenu={hoverMenu}
            handleLogout={handleLogout}
            />
          <Iframe
            proxy={proxy}
			iframeURLadmin={iframeURLadmin}
            iframeURL={iframeURL}
          />
          <Chat
			name={name}
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
            checkedIframeInputAdmin={checkedIframeInputAdmin}
            handleChangeChat={handleChangeChat} 
            handleChangeMenu={handleChangeMenu} 
            handleHoverChat={handleHoverChat}
            handleHoverMenu={handleHoverMenu}
            handleChangeIframeInputAdmin={handleChangeIframeInputAdmin}
            />
      </div>
  );
}

export default Main;