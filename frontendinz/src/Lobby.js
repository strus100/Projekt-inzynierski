import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {AContext} from "./AContext";
import axios from 'axios';
import RoomInfo from "./RoomInfo";
import Footer from "./Footer";
import './App.css'

function Lobby(props){
	const [roomsList, setRoomsList] = useState([{"id":"3","roomName":"Wst\u0119p do Matematyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"}]);
	const [roomsFilter, setRoomsFilter] = useState([{"id":"3","roomName":"Wst\u0119p do Matematyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"4","roomName":"Wst\u0119p do Informatyki","name":"Rados\u0142aw","surname":"Fiweg"},{"id":"16","roomName":"test","name":"Rados\u0142aw","surname":"Fiweg"}]);
	let history = useHistory();
	const {admin, setAdmin} = useContext(AContext);
    const {setAuthenticated} = useContext(AContext);

	const {setName} = useContext(AContext);
	const {setSurname} = useContext(AContext);
	const {setAccess} = useContext(AContext);
	const {setToken} = useContext(AContext);
	
    const createLobby = e => {
		var name = document.getElementById("roomName").value;
		if(name){
		  axios.post('/rooms/', {
			name: name
		  })
		  .then(function (response) {
			//setRoomsList(response.data);
			history.push("/main/"+response.data);
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
		if(x === null || x === undefined || x === ''){
			setRoomsFilter(roomsList);
		}else{
			setRoomsFilter(roomsList);
			const regex = new RegExp("^.*"+x+".*$", 'gi');
			const filtered = roomsList.filter((a) => {
				//console.log("inside filter " + x);
				return a.roomName.match(regex) || a.name.match(regex) || a.surname.match(regex);
			  });
			  setRoomsFilter(filtered);
			  //console.log(regex);
		}
	  }

        return(
        <div className="lobby">   
			{admin &&  
			<div className="createroom">
				<h1>Create room</h1>
				<input id="roomName" type="text"></input><br></br>
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