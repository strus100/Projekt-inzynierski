import React, { useState, useContext, useEffect } from 'react';
import Menu from "../gui/Menu";
import Chat from "./Chat";
import Footer from "../gui/Footer";
import Iframe from "./Iframe";
import IframeInputAdmin from "./IframeInputAdmin";
import Popup from "../gui/Popup";
import PopupSettings from "../gui/PopupSettings";
import PopupAttendanceList from "../gui/PopupAttendanceList";
import Loader from "../other/Loader";
import {AContext} from "../../context/AContext";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/App.css';

function Main(props) {
  const [hoverMenu, setHoverMenu] = useState(false);
  const [checkedMenu, setChangeMenu] = useState(false);
  const [hoverChat, setHoverChat] = useState(false);
  const [checkedChat, setChangeChat] = useState(true);
  const [checkedIframeInputAdmin, setCheckedIframeInputAdmin] = useState(false);
  const [messages, setMesseges] = useState([]);
  //const [historyB, setHistoryB] = useState([{title: "strus100/Projekt-inzynierski", link: "https://github.com/strus100/Projekt-inzynierski", date: "2020-12-10 20:00"}, {title: "Projekt Inżynierski – Dysk Google", link: "https://drive.google.com/drive/folders/1OBH7hwjS7rxf_lPeMfBeXzLsXSPu-4sN", date: "2020-12-10 20:00"}]);
  const [historyB, setHistoryB] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [ws, setWebsocket] = useState(null); 
  const [iframeURL, setIframeURL] = useState(""); 
  const [blockChat, setBlockChat] = useState(false);
  //console.log('in render:', blockChat)

//   const [roomAPILogin, setRoomAPILogin] = useState("");
//   const [roomAPIToken, setRoomAPIToken] = useState("");

//   const [userAPILogin, setUserAPILogin] = useState("");
//   const [userAPIToken, setUserAPIToken] = useState("");

  const {setAuthenticated} = useContext(AContext);
  const {setAdmin} = useContext(AContext);
  
  const {login} = useContext(AContext);
  const {name, setName} = useContext(AContext);
  const {surname, setSurname} = useContext(AContext);
  const {setAccess} = useContext(AContext);
  const {setToken} = useContext(AContext);
  
  const [iframeURLadmin, setIframeURLadmin] = useState(""); 
  //const URL = 'wss://s153070.projektstudencki.pl:3000';
  const URL = 'ws://localhost:1111';
  //const proxy = 'https://s153070.projektstudencki.pl/proxy/index.php?url=';
  const proxy = 'http://localhost/proxy/index.php?url=';

  const { id } = useParams();
  const [adminName, setAdminName] = useState("");

  const [roomName, setRoomName] = useState("");
  const [roomAdmin, setRoomAdmin] = useState(false); //zmienić na false
  const [loadingMain, setLoadingMain] = useState(false); //zmienić na false

//   useEffect(() => {
	// axios.post('/rooms/', {
	// 	roomID: id
	//   })
	//   .then(function (response) {
	// 	if(response.data.admin){ // do poprawy back
	// 		setRoomAdmin(true);
	// 	}
	// 	setRoomName(response.data.name);
	// 	addMessage({ type: "chat", chat: "Witaj na kanale " + response.data.name + " wpisz /help, aby uzyskać pomoc dotyczącą chatu.", name: "SERVER", messagetype: "chat" });
	// 	if(response) setLoadingMain(true);
	// 	//document.title = id + " WykładyWebowe";
	//   })
	//   .catch(function (error) {
	// 	//addMessage({ type: "chat", chat: "Witaj na kanale " + roomName + " wpisz /help, aby uzyskać pomoc dotyczącą chatu.", name: "SERVER", messagetype: "chat" });
	// 	console.log(error);
	// 	//document.title = id + " WykładyWebowe";
	//   });

	useEffect(() => {
		var bodyFormData = new FormData();
		bodyFormData.append('roomId', id);
		axios.all([
			axios.post('/API/UsersByRoom.php', bodyFormData, {
				headers: {'Content-Type': 'multipart/form-data'}	
			}),
			axios.post("/rooms/", {
				roomID: id 
			})
		])
		.then(axios.spread((usersByRoomAPI, roomsAPI) => {
			if(usersByRoomAPI && roomsAPI){
				if(roomsAPI.data.admin){ // do poprawy back
					setRoomAdmin(true);
				}
				setRoomName(roomsAPI.data.name);
				addMessage({ type: "chat", chat: "Witaj na kanale " + roomsAPI.data.name + " wpisz /help, aby uzyskać pomoc dotyczącą chatu.", name: "SERVER", messagetype: "chat" });
				if(roomsAPI) setLoadingMain(true);
				if(usersByRoomAPI) setAdminName(usersByRoomAPI.data.name + " " + usersByRoomAPI.data.surname);
				//document.title = id + " WykładyWebowe";
			}
		}))
		.catch(function (error){
			console.log(error);
		});

	// możliwe że się przyda

	//   axios.all([
	// 	  	axios.post('/API/UsersByRoom.php', {
	// 			roomID: id 	
	// 		}),
	// 		axios.post("/API/user.php", {
	// 			login: userLogin  
	// 		})
	// 	])
	// 	.then(axios.spread((usersByRoomAPI, userAPI) => {
	// 		if(usersByRoomAPI && userAPI){
	// 			setRoomAPILogin(usersByRoomAPI.data.login);
	// 			setRoomAPIToken(usersByRoomAPI.data.token);
	// 			setUserAPILogin(userAPI.data.login);
	// 			setUserAPIToken(userAPI.data.token);
	// 		}
	// 	}))
	// 	.catch(function (error){
	// 		console.log(error);
	// 	});

  }, [])

  useEffect(() => {
	  window.scrollTo(0,0);
  }, [])

  useEffect(() => {
	if(loadingMain){
		var timeout = 1000;
		var connectInterval;
		var callbackInterval;
		var webSocket;

		function checkLoadedIframe(callback){
			var contentDocument = null;
			if(roomAdmin){
				contentDocument = document.getElementById("scoreboardx").contentDocument;
			}else{
				contentDocument = document.getElementById("scoreboard").contentDocument;
			}
			if(contentDocument.readyState !== "complete" && window.location.href.indexOf("room") > -1 && contentDocument !== null){
				callbackInterval = setTimeout(function(){
					checkLoadedIframe(callback);
				}, 500);
				//console.log("scrolled");
			}
			else{
				callback();
				//console.log("callback");
			}
		}
		
		function connect(){
		webSocket = new WebSocket(URL);
	
		webSocket.onopen = () => {
			//timeout = 1000;
			//console.log('connected');
			//webSocket.send(token);
			//webSocket.send("1"); //debug
			clearTimeout(connectInterval);
			setWebsocket(webSocket);
		};
	
		webSocket.onmessage = (evt) => {
			const message = evt.data;
			//console.log(JSON.parse(message).type);
			switch(JSON.parse(message).type){
			case "chat": return addMessage(JSON.parse(message));
			case "auth": return connected();
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
			case "updatehistory": return handleUpdateHistory(JSON.parse(message).history);
			}
		};
	
		webSocket.onclose = e => {
			if(window.location.href.indexOf("room") > -1){
				//setWebsocket(null); //do przetestowania - możliwy błąd uncomment jeśli wina backu
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
			if ((!ws || ws.readyState === WebSocket.CLOSED) && (window.location.href.indexOf("room") > -1)) {
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

		function connected(){
			if(roomAdmin){
				setListeners();
				//console.log("roomAdmin");
			}
			const message = { type: "chat", chat: `Połączono z chatem.`, name: "SERVER" }
			addMessage(message);
		  }
	}

	return () => {
	//   console.log("clear");
	  clearTimeout(connectInterval);
	  clearInterval(callbackInterval);
	  if(roomAdmin && (document.getElementById("scoreboardx") !== null && document.getElementById("scoreboardx").contentDocument !== null && document.getElementById("scoreboardx") !== undefined && document.getElementById("scoreboardx").contentDocument !== undefined)){
		//removeListenerScroll();
	  }
	  if(webSocket){
		webSocket.close();
		setWebsocket(null);
	  }
	};
  }, [loadingMain]);

  function scrollToBottom (id) {
	var div = document.getElementById(id);
	if(div)	div.scrollTop = div.scrollHeight - div.clientHeight;
	//console.log("dol " + blockChat); a może tylko na moje wiadomości?
 }

 function handleAddMessage(message){
	setMesseges(x => [...x, message] );
 }

 function addMessageCallback(x, callback){
	 callback(x);
	 const timer = setTimeout(() => {
		if(!blockChat) scrollToBottom("chat-area");
	  }, 100);

	  return () => clearTimeout(timer); 
 }

  function addMessage(message){
	 // setMesseges(x => [message, ...x] );
	 addMessageCallback(message, handleAddMessage);
	   //beep();
  }

  function submitMessage(messageString){
    if( ws != null ){
      if( ws.readyState === 1 ){
        if( messageString !== ""){
			var message = "";
			if(messageString[0] === "/"){
				if(messageString[1] === "c" && messageString.trim().length !== 2 && messageString[2] === " "){
					message = { type: "chat", chat: messageString.replace("/c ",""), name: name+" "+surname, messagetype: "code" };
					ws.send(JSON.stringify(message));
				}
				else if(messageString === "/help" || messageString === "/h" || messageString === "/pomoc"){
					message = { type: "chat", chat: "Komendy dostępne na czacie: \n\n/c tekst -> Wyświetla tekst jako kod\n\n/help -> Wyświetla pomoc\n\n//tekst -> pozwala na wypisanie wiadomości, która zaczyna się od '/' na czacie (nie będzie traktowana jako komenda), przykładowo '//c tekst' wypisze '/c tekst'", name: "SERVER", messagetype: "code" }
					addMessage(message);
				}
				else if(messageString === "/c"){
					message = { type: "chat", chat: "/c tekst -> Wyświetla tekst jako kod", name: "SERVER", messagetype: "code" }
					addMessage(message);
				}
				else if(messageString[1] === "/"){
					message = { type: "chat", chat: messageString.slice(1), name: name+" "+surname, messagetype: "chat" };
					ws.send(JSON.stringify(message))
				}
				else{
					message = { type: "chat", chat: "Nieznana komenda: " + messageString, name: "SERVER", messagetype: "chat" };
					addMessage(message);
				}
			}else{
				message = { type: "chat", chat: messageString, name: name+" "+surname, messagetype: "chat" };
				ws.send(JSON.stringify(message))
			}
			// if(!messageString.includes("/c", 0)){
			// 	message = { type: "chat", chat: messageString, name: name+" "+surname, messagetype: "chat" };
			// }
			// else{
			// 	message = { type: "chat", chat: messageString.replace("/c",""), name: name+" "+surname, messagetype: "code" };
			// 	//message.chat.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
			// }
			// //console.log(messageString);
          	// ws.send(JSON.stringify(message))
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
		if(roomAdmin && document.getElementById("scoreboardx").contentDocument){ // jak wywali coś złego to trzeba inaczej załatwić url change
			setIframeURLadmin(url);
			document.getElementById("scoreboardx").contentDocument.location.reload(true);
		}
	  }
  }

  function handleUsersList(x){
	  setUsersList(x);
  }

  function handleUpdateHistory(x){
	  if(roomAdmin) setHistoryB(x);
  }

  function changePermission(login){
	const message = { type: "mute", login: login };
	ws.send(JSON.stringify(message))
	}

  return (
	  <div className="main">
		  <span style={{zIndex: 150, position: "fixed", height: 70+"px", width: 70+"px", clipPath: "circle(50px at 7px 7px)"}}>		
				<div className="circle2">{props.lightMode ? <span className="material-icons themebutton" onClick={props.lightModeHandler}>bedtime</span>: <span className="material-icons themebutton" onClick={props.lightModeHandler} style={{color: "#fff"}}>brightness_4</span>
				}</div>
			</span>
		  {loadingMain ?
			<div>
				{ roomAdmin ?
					<div className={"iframe-container-chat"}>
						<iframe src={"../WEBRTC/audio-admin.html?id="+id} className={"iframe-container"} allow="camera *;microphone *"/>
					</div>
					:
					<div className={"iframe-container-chat"}>
						<iframe src={"../WEBRTC/audio-user.html?id="+id} className={"iframe-container"} allow="camera *;microphone *"/>
					</div>
				}
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
			{roomAdmin && <PopupSettings
							fromMain={true}
							roomName={roomName}
							handleChangeURL={handleChangeURL}
							id={id}
							/>}
			{roomAdmin && <PopupAttendanceList
							roomAdmin={roomAdmin}
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
				scrollToBottom={scrollToBottom}
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
				// roomAPILogin={roomAPILogin}
				// roomAPIToken={roomAPIToken}
				// userAPILogin={userAPILogin}
				// userAPIToken={userAPIToken}
				id={id}
				login={login}
				adminName={adminName}
				/>
			</div>
			:
			<div>
				<Loader/>
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
