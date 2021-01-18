import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

function PopupQuestion(props){
  
    useEffect(() => {
        window.addEventListener('click', function(event) {
          if (event.target === document.getElementById("myModalQ")) {
              document.getElementById("myModalQ").style.display = "none";
          }
          if (event.target === document.getElementsByClassName("closeQ")[0]) {
              document.getElementById("myModalQ").style.display = "none";
          }
          if(props.roomId){
            if (event.target === document.getElementById("nobuttonenter")) {
              document.getElementById("myModalQ").style.display = "none";
            }
          }
        }
        )
        
      }, [])

  return (
    
    <div id="myModalQ" className="modal">
      {props.roomId !== "0" &&
            <div className="modal-content">
            <span className="closeQ">&times;</span>
                <div className="modal-inside">
                    <p>Czy jesteś pewien, że chcesz dołączyć do pokoju<br></br><span id="popupRoomname">{props.popupRoomname} ({props.roomId})</span><br></br>użytkownika <span id="popupName">{props.popupName}</span> <span id="popupSurname">{props.popupSurname}</span> (<span id="popupLogin">{props.popupLogin}</span>)? </p>
                    <a id="popupLink" href={"/room/"+props.roomId}><button className="enter_course">Przejdź do kursu</button></a> <button id="nobuttonenter" className="enter_course">Nie</button>
                </div>
            </div>
          }
      {props.createLobbyV && 
        <div className="modal-content">
        <span className="closeQ">&times;</span>
            <div className="modal-inside">
                <p>Czy jesteś pewien, że chcesz stworzyć pokój<br></br><span id="popupRoomnameC">{props.createRoomName}</span>? </p>
                <a id="popupLink"><button onClick={props.createLobby} className="enter_course">Stwórz</button></a> <button id="nobuttonenter" className="enter_course">Nie</button>
            </div>
        </div>
      }
    </div>
    
    
  )
}

export default PopupQuestion