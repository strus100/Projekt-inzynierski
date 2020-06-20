import React, { useState, useContext, useEffect } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import Iframe from "./Iframe"
import IframeInputAdmin from "./IframeInputAdmin"
import {AContext} from "./AContext"
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './App.css';

function Main(props) {
  const [hoverMenu, setHoverMenu] = useState(false);
  const [checkedMenu, setChangeMenu] = useState(false);
  const [hoverChat, setHoverChat] = useState(false);
  const [checkedChat, setChangeChat] = useState(false);
  const [checkedIframeInputAdmin, setCheckedIframeInputAdmin] = useState(false);
  const [messages, setMesseges] = useState([{name: "Mały Kodziarz", messagetype: "code", chat: `for (int i = 0; i < 5; i++) {
	cout << i << "\\n";
  }`}]);
  const [historyB, setHistoryB] = useState([{title: "strus100/Projekt-inzynierski", link: "https://github.com/strus100/Projekt-inzynierski"}, {title: "Projekt Inżynierski – Dysk Google", link: "https://drive.google.com/drive/folders/1OBH7hwjS7rxf_lPeMfBeXzLsXSPu-4sN"}]);
  const [usersList, setUsersList] = useState([{name: "Dawid", permission: true}, {name: "Radek", permission: false}, {name: "Daniel", permission: true}]);
  const [ws, setWebsocket] = useState(null); 
  const [iframeURL, setIframeURL] = useState("http://wmi.amu.edu.pl"); 
  const {setAuthenticated} = useContext(AContext);
  const {setAdmin} = useContext(AContext);
  
  const {name, setName} = useContext(AContext);
  const {surname, setSurname} = useContext(AContext);
  const {setAccess} = useContext(AContext);
  const {token, setToken} = useContext(AContext);
  
  const [iframeURLadmin, setIframeURLadmin] = useState("http://wmi.amu.edu.pl"); 
  const URL = 'wss://localhost:3000';
  const proxy = 'http://localhost/proxy/index.php?url=';

  const { id } = useParams();

  const [roomAdmin, setRoomAdmin] = useState(false); //zmienić na false
  const [loadingMain, setLoadingMain] = useState(false); //zmienić na false

  useEffect(() => {
	axios.post('/rooms/', {
		roomID: id
	  })
	  .then(function (response) {
		if(response.data){
			setRoomAdmin(true);
		}
		else{
			setRoomAdmin(false);
		}
		setLoadingMain(true);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
  }, [])

  useEffect(() => {
	if(loadingMain){
		var timeout = 1000;
		var connectInterval;
		var webSocket;
		
		function connect(){
		webSocket = new WebSocket(URL);
	
		webSocket.onopen = () => {
			//console.log('connected');
			const message = { type: "chat", chat: `Połączono z chatem.`, name: "SERVER" }
			addMessage(message);
			webSocket.send(token);
			//webSocket.send("1"); //debug
			clearTimeout(connectInterval);
			setWebsocket(webSocket);
			if(roomAdmin){
			setListeners();
			//console.log("roomAdmin");
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
			case "updatelist": return handleUsersList(JSON.parse(message));
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
			if(roomAdmin && (document.getElementById("scoreboardx") !== null && document.getElementById("scoreboardx").contentDocument !== null && document.getElementById("scoreboardx") !== undefined && document.getElementById("scoreboardx").contentDocument !== undefined)){
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
		if(roomAdmin){
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
			if(roomAdmin){
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
	}

	return () => {
	  console.log("clear");
	  clearInterval(connectInterval);
	  if(roomAdmin && (document.getElementById("scoreboardx") !== null && document.getElementById("scoreboardx").contentDocument !== null && document.getElementById("scoreboardx") !== undefined && document.getElementById("scoreboardx").contentDocument !== undefined)){
		//removeListenerScroll();
	  }
	  if(webSocket){
		webSocket.close();
		setWebsocket(null);
	  }
	};
  }, [loadingMain]);

  function addMessage(message){
      setMesseges(x => [message, ...x] );
  }

  function submitMessage(messageString){
    if( ws != null ){
      if( ws.readyState === 1 ){
        if( messageString !== ""){
			var message = "";
			if(!messageString.includes("/c", 0)){
				message = { type: "chat", chat: messageString, name: name+" "+surname, messagetype: "chat" };
			}
			else{
				message = { type: "chat", chat: messageString.replace("/c",""), name: name+" "+surname, messagetype: "code" };
				//message.chat.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
			}
			//console.log(messageString);
          	ws.send(JSON.stringify(message))
          	//addMessage(message)
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
	  if(url){
		e.preventDefault();
		setIframeURL(url);
		if(roomAdmin){
			document.getElementById("scoreboardx").contentDocument.location.reload(true);
		}
	  }
  }

  function handleUsersList(x){
	  setUsersList(x);
  }

  function changePermission(namex){
	let copy = JSON.parse(JSON.stringify(usersList))
	let foundIndex = copy.findIndex(x => x.name === namex);
	copy[foundIndex].permission = !copy[foundIndex].permission
	setUsersList(copy);
	}

  return (
	  <div className="main">
		  <div className={"iframe-container-chat"}>
			  <iframe src={"https://strus100.github.io/video-broadcasting.html"} className={"iframe-container"}/>
		  </div>
		  {loadingMain ?
			<div>
				<h1>{ id }</h1>
			{roomAdmin &&
			<IframeInputAdmin
				checkedIframeInputAdmin={checkedIframeInputAdmin}
				iframeURL={iframeURL}
				handleChangeURL={handleChangeURL}
			/>
			}
			<Menu 
				checkedMenu={checkedMenu} 
				hoverMenu={hoverMenu}
				handleLogout={handleLogout}
				/>
			<Iframe
				proxy={proxy}
				roomAdmin={roomAdmin}
				iframeURLadmin={iframeURLadmin}
				iframeURL={iframeURL}
			/>
			<Chat
				roomAdmin={roomAdmin}
				name={name}
				surname={surname}
				checkedChat={checkedChat} 
				hoverChat={hoverChat} 
				ws={ws} 
				messages={messages} 
				historyB={historyB}
				usersList={usersList}
				changePermission={changePermission}
				submitMessage={submitMessage}
				handleChangeURL={handleChangeURL}
				/>
			<Footer 
				lobby={false}
				roomAdmin={roomAdmin}
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
			:
			<div>
				<h1>Loading</h1>
				<Menu 
					checkedMenu={checkedMenu} 
					hoverMenu={hoverMenu}
					handleLogout={handleLogout}
					/>
				<Footer 
					roomAdmin={roomAdmin}
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
		  }
      </div>
  );
}

export default Main;
