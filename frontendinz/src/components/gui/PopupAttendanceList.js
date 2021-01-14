import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useState } from 'react';
import AttendanceList from "./AttendanceList"

function PopupAttendanceList(props){

    const [attendancelist, setAttendancelist] = useState([{a: "a"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}, {b: "b"}]);
  
    useEffect(() => {
        window.addEventListener('click', function(event) {
          if (event.target === document.getElementById("myModalAL")) {
              document.getElementById("myModalAL").style.display = "none";
          }
          if (event.target === document.getElementsByClassName("closeQ")[0]) {
              document.getElementById("myModalAL").style.display = "none";
          }
          if(props.roomId){
            if (event.target === document.getElementById("nobuttonenter")) {
              document.getElementById("myModalAL").style.display = "none";
            }
          }
        }
        )
        
      }, [])

  return (
    
    <div id="myModalAL" className="modal">
      {props.roomAdmin &&
            <div className="modal-content">
            <span className="closeQ">&times;</span>
                <div className="modal-inside">
                    <input type="button" value="GENERUJ LISTĘ TERAZ" className="attendancebtn"/>

                    <table className="attendancelisttable">
                                    <thead>
                                        <tr><th>ID</th><th>Data</th><th>Lista</th><th>Usuń</th></tr>
                                    </thead>
                                    <tbody>
                                        {attendancelist.map((attendancelist, index) =>
                                        <AttendanceList
                                            
                                        />,
                                        )}
                                    </tbody>
                                </table>
                </div>
            </div>
          }
    </div>
    
    
  )
}

export default PopupAttendanceList