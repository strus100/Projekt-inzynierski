import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import {AContext} from "./AContext";
import axios from 'axios';
import RoomInfo from "./RoomInfo";
import Footer from "./Footer";
import Menu from "./Menu";
import './App.css'

function Lobby(props){   
	const [roomsList, setRoomsList] = useState([{"id":"3","roomName":"Wst\u0119p do Matematyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"}]);
	const [roomsFilter, setRoomsFilter] = useState([{"id":"3","roomName":"Wst\u0119p do Matematyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"}]);
	let history = useHistory();
	const {admin, setAdmin} = useContext(AContext);
    const {authenticated, setAuthenticated} = useContext(AContext);

	const {login, setLogin} = useContext(AContext);
	const {name, setName} = useContext(AContext);
	const {surname, setSurname} = useContext(AContext);
	const {access, setAccess} = useContext(AContext);
	const {token, setToken} = useContext(AContext);
	
    const createLobby = e => {
        axios.post('/rooms/', {
			name: "test"
		  })
		  .then(function (response) {
			//setRoomsList(response.data);
			history.push("/main/"+response.data);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
    }
	  useEffect(() => {
		axios.get('/rooms/', {
		  })
		  .then(function (response) {
			setRoomsList(response.data);
			setRoomsFilter(response.data);
		  })
		  .catch(function (error) {
			console.log(error);
		  });
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

	  /*do naprawienia*/
	  function filterRooms(x){ 
		setRoomsFilter(roomsList);
		if(x == null || x == undefined || x == ''){
			setRoomsFilter(roomsList);
		}else{
			setRoomsFilter(roomsList);
			const regex = new RegExp("^.*"+x+".*$", 'g');
			const filtered = roomsList.filter((a) => {
				console.log("inside filter " + x);
				return a.roomName.match(regex) || a.name.match(regex) || a.surname.match(regex);
			  });
			  setRoomsFilter(filtered);
			  console.log(regex);
		}
	  }

        return(
        <div className="lobby">   
			{admin &&  
			<div className="createroom">
				<h1>Create room</h1>
				<input type="text"></input><br></br>
				<button onClick={()=>createLobby()}>create</button>
			</div>
			}
			
			<div className="findroom">
				<input type="text" placeholder="Find room" onChange={(e) => filterRooms(e.target.value)}></input>
				<br></br>
			</div>
			
			<div className="roominfo--div">       
				{roomsFilter.map((room, index) =>
				<RoomInfo
					key={index}
					id={room.id}
					name={room.name}
					surname={room.surname}
					roomName={room.roomName}
				/>
				)}
			</div>
			<div className="clear"></div>
			<Footer
				lobby={true}
				handleLogout={handleLogout}
				/>
		</div>
        )
} 

export default Lobby;