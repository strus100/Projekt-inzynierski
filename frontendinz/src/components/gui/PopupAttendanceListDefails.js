import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useState } from 'react';

function PopupAttendanceListDetails(props){

    const [attendancelistdetails, setAttendancelistdetails] = useState([{a: "a"}]);
  
    useEffect(() => {
        window.addEventListener('click', function(event) {
          if (event.target === document.getElementById("myModalAL")) {
              document.getElementById("myModalALD").style.display = "none";
          }
          if (event.target === document.getElementsByClassName("closeQ")[0]) {
              document.getElementById("myModalALD").style.display = "none";
          }
        }
        )
        
      }, [])

  return (
    
    <div id="myModalALD" className="modal">
      {props.roomAdmin &&
            <div className="modal-content">
            <span className="closeQ">&times;</span>
                <div className="modal-inside">
                    AAAAAAAAA
                </div>
            </div>
          }
    </div>
    
    
  )
}

export default PopupAttendanceListDetails