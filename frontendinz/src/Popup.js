import React, { useEffect, useState, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useHistory } from "react-router-dom";
import FileList from "./FileList"
import axios from 'axios';
import {AContext} from "./AContext"
import './App.css'

function Popup(props){   
    const [files, setFiles] = useState([])
    const {token} = useContext(AContext);
    const [roomNameTmp, setRoomNameTmp] = useState("");
    const [disabledButton, setDisabledButton] = useState(false);
    const [disabledButton2, setDisabledButton2] = useState(false);
    const [disabledButton3, setDisabledButton3] = useState(false);
    let history = useHistory();

    useEffect(() => {
      updateFiles();
        
      window.onclick = function(event) {
        if (event.target == document.getElementById("myModal")) {
            document.getElementById("myModal").style.display = "none";
        }
        if (event.target == document.getElementsByClassName("close")[0]) {
            document.getElementById("myModal").style.display = "none";
        }
      }
      var rname = props.roomName; 
      setRoomNameTmp(rname);
    }, [])

    function dragHandler(){
        document.getElementById("uploadbtn").classList.add("dragover");
    }  

    function dragHandlerRemove(){
        document.getElementById("uploadbtn").classList.remove("dragover");
    }  

    function handleSetRoomNameTmp(e){
        setRoomNameTmp(e);
    }

    function handleOnChangeFiles(e){
        var list = '';
        for (var i = 0; i < e.target.files.length; i++) {
            list += e.target.files[i].name + "<br>";
        }
        document.getElementById("uploadbtn").innerHTML = "Wybrano plików: " + e.target.files.length + "<br>" + list;
        document.getElementById("uploadbtn").classList.remove("dragover");
        // console.log(e.target.files)
    }

    /* AXIOSY */

    function handleChangeName(){
        setDisabledButton(true);
        axios.post('/rooms/', { roomID: props.id, name: roomNameTmp })
		.then(function (response) {
            setDisabledButton(false);
			history.push("/lobby");
		})
		.catch(function (error) {
            setDisabledButton(false);
			console.log(error);
        });	
    }

    function handleUploadFile(e){
        if(e.target){
            setDisabledButton3(true);
            e.preventDefault();
            var formData = new FormData();
            var file = document.getElementById("files");
            for (var i = 0; i < file.files.length; i++) {
                formData.append("files[]", file.files[i]);
                // console.log(file.files[i]);
            }
            // console.log(formData.getAll('files[]'));
            axios.post('/files/upload/', formData, { 
                    headers: {
                    'Content-Type': 'multipart/form-data'
                } })
                .then(function (response) {
                    //setFiles(response.data); //lub updateFiles() jeszcze, zależy od backu
                    formData = null;
                    document.getElementById("files").value = "";
                    document.getElementById("uploadbtn").innerHTML = "Wybierz plik";
                    updateFiles();
                    setDisabledButton3(false);
                })
                .catch(function (error) {
                    setDisabledButton3(false);
                    console.log(error);
                });
            
            //console.log(document.getElementById("files").value);
            }
    }

    function removeFile(argName){
        axios.post('/files/delete/', { name: argName })
                .then(function (response) {
                    //setFiles(response.data); //lub updateFiles() jeszcze, zależy od backu
                    updateFiles();
                })
                .catch(function (error) {
                    console.log(error);
                });
            // console.log(name);
    }

    function updateFiles(){
        axios.get('/files/', {})
		.then(function (response) {
            if(Array.isArray(response.data)){
			    setFiles(response.data);
            }
		})
		.catch(function (error) {
			console.log(error);
        });
    }

    function handleDeleteRoom(){
        setDisabledButton2(true);
        axios.post('/rooms/', { deleteID: props.id })
		.then(function (response) {
            setDisabledButton2(false);
			history.push("/lobby");
		})
		.catch(function (error) {
            setDisabledButton2(false);
			console.log(error);
        });
    }

    return(
        <div id="myModal" className="modal">
            <div className="modal-content">
            <span className="close">&times;</span>
                <div className="modal-inside">
                <Tabs>
                    <TabList>
                        {props.fromMain && <Tab>Ogólne</Tab>}
                        <Tab>Pliki</Tab>
                    </TabList>

                    {props.fromMain &&
                    <TabPanel>
                        <div className="general-area">
                            <h1 style={{marginTop: 10 + "px"}}>Nazwa pokoju</h1>
                            <h2>{props.roomName}</h2>
                            <input type="text" value={roomNameTmp} onChange={(e) => handleSetRoomNameTmp(e.target.value)}></input><br></br>
                            <button className="generalbtn" onClick={() => handleChangeName()} disabled={disabledButton}>Zmień</button>
                            <br></br>
                            <button className="generalbtn" onClick={() => handleDeleteRoom()} disabled={disabledButton2}>Delete</button>
                        </div>
                    </TabPanel>
                    }
                    <TabPanel>
                       <div id="drop-area">
                        <h1>Wrzuć plik</h1>
                            <form className="drop-form">
                            <div className="upload-btn-wrapper">
                                <button className="btn" id="uploadbtn">Wybierz plik</button>
                                <input 
                                    name="files[]" 
                                    id="files" 
                                    className="custom-file-input" 
                                    type="file" 
                                    multiple 
                                    onChange={(e) => handleOnChangeFiles(e)} 
                                    onDragOver={() => dragHandler()} 
                                    onDragLeave={() => dragHandlerRemove()} 
                                    onDragExit={() => dragHandlerRemove()}
                                    >
                                </input>
                            </div>
                                {/*<label className="filelabel" htmlFor="fileElem">
                                    <input type="file" id="fileElem" multiple onChange={() => console.log("file")}>
                                        
                                        </input>
                                </label>*/}
                                <button className="filesbtn" onClick={(e) => handleUploadFile(e)} disabled={disabledButton3}>Potwierdź</button>
                            </form>
                            <h1>Lista plików użytkownika</h1>
                            <div style={{overflowX: "auto"}}>
                                <table className="filestable">
                                    <thead>
                                        <tr><th>ID</th><th>Plik</th><th></th></tr>
                                    </thead>
                                    <tbody>
                                        {files.map((files, index) =>
                                        <FileList
                                            removeFile={removeFile}
                                            key={index}
                                            id={files.id}
                                            name={files.name}
                                            fromMain={props.fromMain}
                                            locationx={files.location}
                                            handleChangeURL={props.handleChangeURL}
                                        />,
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
                </div>
            </div>
        </div>         
    )
} 

export default Popup;