import React, { useEffect, useState, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FileList from "./FileList"
import axios from 'axios';
import {AContext} from "./AContext"
import './App.css'

function Popup(props){   
    const [files, setFiles] = useState(
        [{filename: "aaa", room: "ccc", link: "c"},{filename: "awaaaa", room: "ccwqc", link: "cee"},{filename: "aaa", room: "cccw", link: "cq"} ])
    const {token} = useContext(AContext);
    const [roomNameTmp, setRoomNameTmp] = useState("");

    useEffect(() => {
        //updateFiles();
        
      window.onclick = function(event) {
        if (event.target == document.getElementById("myModal")) {
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

    function handleChangeName(){
        console.log("click");
    }

    function handleOnChangeFiles(e){
        var list = '';
        for (var i = 0; i < e.target.files.length; i++) {
            list += e.target.files[i].name + "<br>";
        }
        document.getElementById("uploadbtn").innerHTML = "Wybrano plików: " + e.target.files.length + "<br>" + list;
        document.getElementById("uploadbtn").classList.remove("dragover");
        console.log(e.target.files)
    }

    /* AXIOSY */

    function handleUploadFile(e){
        if(e.target){
            e.preventDefault();
            axios.post('/files/upload', { /*cos*/ })
                .then(function (response) {
                    //setFiles(response.data); //lub updateFiles() jeszcze, zależy od backu
                })
                .catch(function (error) {
                    console.log(error);
                });
            
            console.log(document.getElementById("files").value);
            }
    }

    function removeFile(name){
        axios.post('/files/delete', { name: name, token: token })
                .then(function (response) {
                    //setFiles(response.data); //lub updateFiles() jeszcze, zależy od backu
                })
                .catch(function (error) {
                    console.log(error);
                });
            console.log(name);
    }

    function updateFiles(){
        axios.get('/files', { token: token })
		.then(function (response) {
			//setFiles(response.data);
		})
		.catch(function (error) {
			console.log(error);
        });
    }

    return(
        <div id="myModal" className="modal">
            <div className="modal-content">
            {/*<span className="close">&times;</span>*/}
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
                            <button className="generalbtn" onClick={() => handleChangeName()}>Change</button>
                        </div>
                    </TabPanel>
                    }
                    <TabPanel>
                       <div id="drop-area">
                        <h1>Upload file</h1>
                            <form className="drop-form">
                            <div className="upload-btn-wrapper">
                                <button className="btn" id="uploadbtn">Upload a file</button>
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
                                <button className="filesbtn" onClick={(e) => handleUploadFile(e)}>confirm</button>
                            </form>
                            <h1>Lista plików użytkownika</h1>
                            <div style={{overflowX: "auto"}}>
                                <table className="filestable">
                                    <thead>
                                        <tr><th>Filename</th><th>Room</th><th>Link</th><th></th></tr>
                                    </thead>
                                    <tbody>
                                        {files.map((files, index) =>
                                        <FileList
                                            removeFile={removeFile}
                                            key={index}
                                            filename={files.filename}
                                            room={files.room}
                                            link={files.link}
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