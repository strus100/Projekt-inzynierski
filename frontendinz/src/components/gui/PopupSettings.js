import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useHistory } from "react-router-dom";
import FileList from "./FileList"
import axios from 'axios';
import '../../css/App.css'

function PopupSettings(props){   
    const [roomNameTmp, setRoomNameTmp] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [disabledButton2, setDisabledButton2] = useState(false);
    const [disabledButton3, setDisabledButton3] = useState(false);
    let history = useHistory();

    useEffect(() => {       
      window.addEventListener('click', function(event) {
        if (event.target === document.getElementById("myModalSettings")) {
            document.getElementById("myModalSettings").style.display = "none";
        }
        if (event.target === document.getElementsByClassName("close")[1]) {
            document.getElementById("myModalSettings").style.display = "none";
        }
      })
      var rname = props.roomName; 
      setRoomNameTmp(rname);
    }, [])

    function handleSetRoomNameTmp(e){
        setRoomNameTmp(e);
    }


    /* AXIOSY */

    function handleChangeName(){
        setDisabledButton(true);
        axios.post('/rooms/', { roomID: props.id, name: roomNameTmp })
		.then(function (response) {
            setDisabledButton(false);
            setRoomNameTmp(roomNameTmp);
		})
		.catch(function (error) {
            setDisabledButton(false);
			console.log(error);
        });	
    }

    function handleDeleteRoom(){
        setDisabledButton2(true);
        axios.post('/rooms/', { deleteID: props.id })
		.then(function (response) {
            setDisabledButton2(false);
            const message = { type: "deleteroomtrigger" };
		    ws.send(JSON.stringify(message))
            history.push("/lobby");
		})
		.catch(function (error) {
            setDisabledButton2(false);
			console.log(error);
        });
    }

    return(
        <div id="myModalSettings" className="modal">
            <div className="modal-content">
            <span className="close">&times;</span>
                <div className="modal-inside">
                
                    <div className="general-area">
                        <h1 style={{marginTop: 0 + "px"}}>Nazwa pokoju</h1>
                        {/* <h2>{props.roomName}</h2> */}
                        <h2>{roomNameTmp}</h2>
                        <input type="text" value={roomNameTmp} onChange={(e) => handleSetRoomNameTmp(e.target.value)}></input><br></br>
                        <button className="generalbtn" onClick={() => handleChangeName()} disabled={disabledButton}>Zmień</button>
                        <br></br><hr style={{marginTop: 50+"px", backgroundImage: "linear-gradient(to right, #ccc, #333, #ccc)", height: 1+"px", border: "0", background: "#333", width: 70+"%"}}></hr>
                        <h1 style={{marginTop: 40 + "px"}}>Usuwanie pokoju</h1>
                        <button className="generalbtn" onClick={() => handleDeleteRoom()} disabled={disabledButton2}>Usuń pokój</button>
                    </div>
                </div>
            </div>
        </div>         
    )
} 

export default PopupSettings;