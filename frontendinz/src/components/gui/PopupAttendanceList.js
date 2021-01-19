import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useState } from 'react';
import AttendanceList from "./AttendanceList"
import { findAllByTestId } from '@testing-library/react';
import AttendanceListDetails from './AttendanceListDetails';
import axios from 'axios';

function PopupAttendanceList(props){

    const [attendancelist, setAttendancelist] = useState([]);
    const [attendanceListDetails, setAttendanceListDetails] = useState([]);
    const [dateList, setDateList] = useState("");
    const [nameList, setNameList] = useState("");
    
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

    useEffect(() => {
        window.addEventListener('click', function(event) {
          if (event.target === document.getElementById("myModalALD")) {
              document.getElementById("myModalALD").style.display = "none";
          }
          if (event.target === document.getElementsByClassName("closeQD")[0]) {
              document.getElementById("myModalALD").style.display = "none";
          }

        }
        )
        
      }, [])

      useEffect(() => {
        getWholeList();
      }, [])

      function getList(e, date, name){
        console.log(e.currentTarget.textContent);
        axios.get('/attendanceList/', { params: { listName: e.currentTarget.textContent, roomID: props.roomID } })
          .then(function (response) {
            setNameList(name);
            setDateList(date);
            setAttendanceListDetails(response.data.list);
            e.preventDefault();
            document.getElementById("myModalALD").style.display = "flex";
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      function createList(e){
        e.preventDefault();
        axios.post('/attendanceList/', { roomID: props.roomID, list: props.usersList })
          .then(function (response) {
            setAttendancelist(response.data.list);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      function getWholeList(){
        axios.get('/attendanceList/', { params: { roomID: props.roomID } })
          .then(function (response) {
            setAttendancelist(response.data.list);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      function deleteList(x){
        console.log(x);
      }

  return (
    
    <div id="myModalAL" className="modal">
      {props.roomAdmin &&
            <div className="modal-content">
            <span className="closeQ">&times;</span>
                <div className="modal-inside">
                    <input type="button" value="GENERUJ LISTĘ TERAZ" className="attendancebtn" onClick={(e) => createList(e)}/>

                    <table className="attendancelisttable">
                                    <thead>
                                        <tr><th>ID</th><th>Data</th><th>Lista</th><th>Usuń</th></tr>
                                    </thead>
                                    <tbody>
                                        {attendancelist.map((attendancelist, index) =>
                                        <AttendanceList
                                            key={index}
                                            getList={getList}
                                            deleteList={deleteList}
                                            name={attendancelist.name}
                                            id={attendancelist.id}
                                            date={attendancelist.date}
                                        />,
                                        )}
                                    </tbody>
                                </table>
                </div>
            </div>
          }
      <div id="myModalALD" className="modal" style={{zIndex: 2000}}>
        {props.roomAdmin &&
              <div className="modal-content">
              <span className="closeQD">&times;</span>
                  <div className="modal-inside">
                    <p>{nameList}</p>
                    <p>{dateList}</p>
                    <table className="attendancelisttable">
                      <thead>
                      <tr><th>Name</th><th>Surname</th></tr>
                      </thead>
                      <tbody>
                        {attendanceListDetails.map((attendanceListDetails, index) =>
                          <AttendanceListDetails
                            key={index}
                            name={attendanceListDetails.name}
                            surname={attendanceListDetails.surname}
                          />
                        )}
                      </tbody>
                    </table>
                  </div>
              </div>
            }
      </div>
    </div>
    
    
  )
}

export default PopupAttendanceList