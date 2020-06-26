import React, { useState, useContext, useEffect } from 'react';
import Menu from "./Menu"
import Chat from "./Chat"
import Footer from "./Footer"
import Iframe from "./Iframe"
import IframeInputAdmin from "./IframeInputAdmin"
import Popup from "./Popup"
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
  const [messages, setMesseges] = useState([]);
  const [historyB, setHistoryB] = useState([{title: "strus100/Projekt-inzynierski", link: "https://github.com/strus100/Projekt-inzynierski"}, {title: "Projekt Inżynierski – Dysk Google", link: "https://drive.google.com/drive/folders/1OBH7hwjS7rxf_lPeMfBeXzLsXSPu-4sN"}]);
  const [usersList, setUsersList] = useState([]);
  const [ws, setWebsocket] = useState(null); 
  const [iframeURL, setIframeURL] = useState("http://wmi.amu.edu.pl"); 
  const {setAuthenticated} = useContext(AContext);
  const {setAdmin} = useContext(AContext);
  
  const {name, setName} = useContext(AContext);
  const {surname, setSurname} = useContext(AContext);
  const {setAccess} = useContext(AContext);
  const {token, setToken} = useContext(AContext);
  
  const [iframeURLadmin, setIframeURLadmin] = useState("http://wmi.amu.edu.pl"); 
  const URL = 'wss://s153070.projektstudencki.pl:3000';
  const proxy = 'https://s153070.projektstudencki.pl/proxy/index.php?url=';

  const { id } = useParams();

  const [roomName, setRoomName] = useState("");
  const [roomAdmin, setRoomAdmin] = useState(false); //zmienić na false
  const [loadingMain, setLoadingMain] = useState(false); //zmienić na false

  useEffect(() => {
	axios.post('/rooms/', {
		roomID: id
	  })
	  .then(function (response) {
		if(response.data){
			setRoomAdmin(true);
			setRoomName(response.data.name);
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

		function checkLoadedIframe(callback){
			var contentDocument = null;
			if(roomAdmin){
				contentDocument = document.getElementById("scoreboardx").contentDocument;
			}else{
				contentDocument = document.getElementById("scoreboard").contentDocument;
			}
			if(contentDocument.readyState !== "complete"){
				setTimeout(function(){
					checkLoadedIframe(callback);
				}, 500);
			}
			else
				callback();
		}
		
		function connect(){
		webSocket = new WebSocket(URL);
	
		webSocket.onopen = () => {
			//console.log('connected');
			const message = { type: "chat", chat: `Połączono z chatem.`, name: "SERVER" }
			addMessage(message);
			//webSocket.send(token);
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
			// console.log(JSON.parse(message).type);
			switch(JSON.parse(message).type){
			case "chat": return addMessage(JSON.parse(message));
			case "event":
				var element = null;
				if(roomAdmin){
					element = document.getElementById("scoreboardx").contentWindow;
				}else{
					element = document.getElementById("scoreboard").contentWindow;
				}
				var parsed = JSON.parse(message);
				switch(parsed.event){
					case "scroll":
						checkLoadedIframe(function(){
							element.scrollTo(parsed.x, parsed.y);
						});
					break;
					case "redirection":
						handleChangeURL(evt, parsed.url);
					break;
				}
				break;
			case "updatelist": return handleUsersList(JSON.parse(message).clients);
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

		// console.log('trying to connect');
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
			// console.log("scroll frame5");
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
	//   console.log("clear");
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
	//   beep();
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

  function changePermission(login){
	const message = { type: "mute", login: login };
	ws.send(JSON.stringify(message))
	}

	function beep() {
		var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
		snd.play();
	}

  return (
	  <div className="main">
		  { roomAdmin ?
			  <div className={"iframe-container-chat"}>
				  <iframe src={"https://s153070.projektstudencki.pl/WEBRTC/audio-admin.html"} className={"iframe-container"} allow="camera *;microphone *"/>
			  </div>
			  :
			  <div className={"iframe-container-chat"}>
				  <iframe src={"https://s153070.projektstudencki.pl/WEBRTC/audio-user.html"} className={"iframe-container"} allow="camera *;microphone *"/>
			  </div>
		  }
		  {loadingMain ?
			<div>
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
				roomAdmin={roomAdmin}
				fromMain={true}
				/>
			<Iframe
				proxy={proxy}
				roomAdmin={roomAdmin}
				iframeURLadmin={iframeURLadmin}
				iframeURL={iframeURL}
			/>
			{roomAdmin && <Popup
							fromMain={true}
							roomName={roomName}
							handleChangeURL={handleChangeURL}
							id={id}
							/>}
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
