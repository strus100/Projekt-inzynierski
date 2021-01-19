import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AContext} from "../../context/AContext";
import axios from 'axios';
import RoomInfo from "./RoomInfo";
import Footer from "../gui/Footer";
import Popup from "../gui/Popup";
import PopupQuestion from "../gui/PopupQuestion";
import '../../css/App.css'

function Lobby(props){
	const [roomsList, setRoomsList] = useState([]);	
	const [roomsFilter, setRoomsFilter] = useState([]);	

	//dane do testów
	// const [roomsList, setRoomsList] = useState([
	// 	{"id":"1","roomName":"Pokój 1","name":"Imię","surname":"Nazwisko", "login":"admin"},
	// 	{"id":"2","roomName":"Pokój 1","name":"Imię","surname":"Nazwisko", "login":"admin"},
	// 	{"id":"3","roomName":"Pokój 1","name":"Imię","surname":"Nazwisko", "login":"admin"}
	// 	]);	
	// const [roomsFilter, setRoomsFilter] = useState([
	// 	{"id":"1","roomName":"Pokój 1","name":"Imię","surname":"Nazwisko", "login":"admin"},
	// 	{"id":"2","roomName":"Pokój 1","name":"Imię","surname":"Nazwisko", "login":"admin"},
	// 	{"id":"3","roomName":"Pokój 1","name":"Imię","surname":"Nazwisko", "login":"admin"}
	// 	]);	
	let history = useHistory();
	const {admin, setAdmin} = useContext(AContext);
    const {setAuthenticated} = useContext(AContext);

	const {setName} = useContext(AContext);
	const {setSurname} = useContext(AContext);
	const {setAccess} = useContext(AContext);
	const {setToken} = useContext(AContext);

	const {name} = useContext(AContext);
	const {surname} = useContext(AContext);
	const {login} = useContext(AContext);

	const [checked, setChecked] = useState(false);
	const [roomId, setRoomId] = useState("0");
	const [createLobbyV, setCreateLobbyV] = useState(false);
	const [createRoomName, setCreateRoomName] = useState("");

	const [popupName, setPopupName] = useState("");
	const [popupSurname, setPopupSurname] = useState("");
	const [popupLogin, setPopupLogin] = useState("");
	const [popupRoomname, setPopupRoomname] = useState("");

	const [currentTab, setCurrentTab] = useState(1);
	const [currentLobbyMode, setCurrentLobbyMode] = useState(1);
	
    const createLobby = e => {
		var name = createRoomName;
		if(name){
		  axios.post('/rooms/', {
			name: name
		  })
		  .then(function (response) {
			//setRoomsList(response.data);
			history.push("/room/"+response.data);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
		}
    }
	  useEffect(() => {
		axios.get('/rooms/', {
		  })
		  .then(function (response) {
			  if(Array.isArray(response.data)){
				setRoomsList(response.data);
				setRoomsFilter(response.data);
			  }
		  })
		  .catch(function (error) {
			console.log(error);
		  });
	  }, [])

	  useEffect(() => {
		window.scrollTo(0,0);
	}, [])

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

	  function handleCurrentTab(x){
		  if(currentTab !== x){
			setCurrentTab(x);
			setRoomsFilter(roomsList);
		  }
	  }

	  function handlePopupLobby(e){
		e.preventDefault();
		handleDestruction();
		document.getElementById("myModalFiles").style.display = "flex";
	  }

	  function handleDestruction(){
		handlePopupId("0");
		setCreateLobbyV(false);
		setCreateRoomName("");
		setPopupName("");
		setPopupSurname("");
		setPopupLogin("");
		setPopupRoomname("");
	  }

	  function handlePopupId(x){
		  setRoomId(x);
	  }

	  function handleCreateLobby(e, x){
		e.preventDefault();
		handleDestruction();
		if(x){
			setCreateLobbyV(true);
			handlePopupId("0");
			setCreateRoomName(x);
			document.getElementById("myModalQ").style.display = "block";
		}
	  }

	  function handlePopupQ(id, namex, surnamex, loginx, roomNamex, e){
		e.preventDefault();
		handleDestruction();
		document.getElementById("myModalQ").style.display = "block";
		//document.getElementById("popupName").innerHTML = namex;
		setPopupName(namex);
		//document.getElementById("popupSurname").innerHTML = surnamex;
		setPopupSurname(surnamex);
		//document.getElementById("popupLogin").innerHTML = loginx;	
		setPopupLogin(loginx);
		//document.getElementById("popupRoomname").innerHTML = roomNamex + " (" + id + ")";	
		setPopupRoomname(roomNamex);
		handlePopupId(id);	
	  }

	  function filterRooms(){ // a może index of?
		var x = document.getElementById("textrooms").value;
		var string = "";
		var array = x.split(' ');
		var lenA = array.length;
		for(var i = 0; i < lenA; i++){
			if(i === 0){
				string = string + array[0];
			}
			else if(i !== lenA-1){
				string = string + "&" + array[i];
			}
			else{
				string = string + "&" + array[i];
			}
			//console.log(i + " " + array[i])
		}
		//var lenA = array.length;
		setRoomsFilter(roomsList);
		// console.log(x);
		if(document.getElementById("myrooms").checked){
			setChecked(true);
			setRoomsFilter(roomsList);
			const regex = new RegExp("^.*"+x+".*$", 'gi');
			// console.log(regex);
			const filtered = roomsList.filter((a) => {
				//console.log(array + " " + lenA);
				// console.log(a.roomName.match(regex) + " " + a.name.match("^.*"+name+".*$", 'gi') + " " + a.surname.match("^.*"+surname+".*$", 'gi'))
				return (a.roomName.match(regex) || a.id.match(regex)) && a.name.match("^.*"+name+".*$", 'gi') && a.surname.match("^.*"+surname+".*$", 'gi') && a.login.match("^.*"+login+".*$", 'gi');
			  });
			//   console.log(filtered);
			  setRoomsFilter(filtered);
		}
		else{
			setChecked(false);
			if(x === null || x === undefined || x === ''){
				setRoomsFilter(roomsList);
			}else{
				setRoomsFilter(roomsList);
				const regex = new RegExp("^.*"+x+".*$", 'gi');
				const filtered = roomsList.filter((a) => {
					//console.log(typeof array + " " + lenA);
					//console.log(string)
					return a.roomName.match(regex) || a.name.match(regex) || a.surname.match(regex) || a.login.match(regex) || a.id.match(regex);
				});
				setRoomsFilter(filtered);
				//console.log(regex);
			}
		}
	  }

	  var classNameLobby = "lobby";
	  if(admin){
		classNameLobby += " adminlobby";
	  }

	  function createLobbyUncategorized(){
		  return(
			roomsFilter.map((room, index) =>
				<RoomInfo
					key={index}
					id={room.id}
					name={room.name}
					surname={room.surname}
					roomName={room.roomName}
					login={room.login}
					handlePopupQ={handlePopupQ}
				/>
				)
		  )
	  }

	  function createLobbyCategorizedByUser(){
		return console.log("test");
	}

        return(
        <div className={classNameLobby}>   
			<span style={{zIndex: 150, position: "fixed", height: 70+"px", width: 70+"px", clipPath: "circle(50px at 7px 7px)"}}>		
				<div className="circle2">{props.lightMode ? <span className="material-icons themebutton" onClick={props.lightModeHandler}>bedtime</span>: <span className="material-icons themebutton" onClick={props.lightModeHandler} style={{color: "#fff"}}>brightness_4</span>
				}</div>
			</span>
			<Tabs>
				<TabList>
				<Tab onClick={() => handleCurrentTab(1)}>Znajdź pokój</Tab>
					{admin && <Tab onClick={() => handleCurrentTab(2)}>Stwórz pokój</Tab>}
				</TabList>
				
				<TabPanel>
					<div className="findroom">
						<input type="text" placeholder="Znajdź pokój" id="textrooms" onChange={() => filterRooms()}></input>
						<br></br>
						
						{admin && <label htmlFor="myrooms" className="myroomsclass">
						<input type="checkbox" id="myrooms" name="myrooms" onChange={() => filterRooms()}></input>
							<span id="myrooms--span">{checked ? <span className='material-icons' id="donesign" style={{fontSize: "inherit"}}>done</span> : "."}</span> <span id="checkbox-text" style={{display:"inline-block"}}>Pokaż moje pokoje</span>
							</label>
						}
						<br></br>
					</div>

					{currentLobbyMode === 1 &&
						<div className="roominfo--div">       
							{createLobbyUncategorized()}
						</div>
					}
					{currentLobbyMode === 2 &&
						<div className="roominfo--div">  
							{createLobbyCategorizedByUser()}
						</div>
					}
				</TabPanel>
				
				{admin &&  
					<TabPanel>
						
						<div className="createroom">
							<input id="roomName" type="text" placeholder="Nazwa pokoju"></input><br></br>
							<button onClick={e=>handleCreateLobby(e, document.getElementById("roomName").value)}>Stwórz</button>
						</div>
						
					</TabPanel>
				}
			</Tabs>
			{admin && <Popup
							fromMain={false}
							/>}
							<PopupQuestion
								roomId={roomId}
								popupRoomname={popupRoomname}
								popupLogin={popupLogin}
								popupName={popupName}
								popupSurname={popupSurname}
								handlePopupId={handlePopupId}
								createLobbyV={createLobbyV}
								createRoomName={createRoomName}
								createLobby={createLobby}
								handleDestruction={handleDestruction}
							/>
				<Footer
					lobby={true}
					handlePopupLobby={handlePopupLobby}
					handleLogout={handleLogout}
					/>
		</div>
        )
} 

export default Lobby;