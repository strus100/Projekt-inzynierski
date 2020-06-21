import React, { useEffect, useState, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import FileList from "./FileList"
import axios from 'axios';
import {AContext} from "./AContext"
import './App.css'

function Popup(props){   
    const [files, setFiles] = useState([{filename: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", room: "WstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstępWstęp"},{filename: "b", room: "Wstęp"},{filename: "a", room: "Wstęp"},{filename: "c", room: "Wstęp"} ])
    const {token} = useContext(AContext);

    useEffect(() => {
        updateFiles();
        
      window.onclick = function(event) {
        if (event.target == document.getElementById("myModal")) {
            document.getElementById("myModal").style.display = "none";
        }
      }
    }, [])

    function updateFiles(){
        axios.get('/files', { token: token })
		.then(function (response) {
			setFiles(response.data);
		})
		.catch(function (error) {
			console.log(error);
        });
    }

    function handleUploadFile(e){
        if(e.target){
            e.preventDefault();
            axios.post('/files/upload', { /*cos*/ })
                .then(function (response) {
                    setFiles(response.data); //lub updateFiles() jeszcze, zależy od backu
                })
                .catch(function (error) {
                    console.log(error);
                });
            
            //console.log(document.getElementById("fileElem").value);
            }
    }

    function removeFile(name){
        axios.post('/files/delete', { name: name, token: token })
                .then(function (response) {
                    setFiles(response.data); //lub updateFiles() jeszcze, zależy od backu
                })
                .catch(function (error) {
                    console.log(error);
                });
            console.log(name);
    }

    return(
        <div id="myModal" className="modal">
            <div className="modal-content">
            {/*<span className="close">&times;</span>*/}
                <div className="modal-inside">
                <Tabs>
                    <TabList>
                        <Tab>Ogólne</Tab>
                        <Tab>Pliki</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="general-area">
                            <p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p>
                            <p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p>
                            <p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p>
                            <p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p>
                        </div>
                    </TabPanel>
                    
                    <TabPanel>
                       <div id="drop-area">
                        <h1>Upload file</h1>
                            <form className="drop-form">
                                <label className="filelabel" htmlFor="fileElem">
                                    <input type="file" id="fileElem" multiple onChange={() => console.log("file")}>
                                        
                                        </input>
                                    </label>
                                <button onClick={(e) => handleUploadFile(e)}>confirm</button>
                            </form>
                            <h1>Lista plików użytkownika</h1>
                            <div style={{overflowX: "auto"}}>
                                <table className="filestable">
                                    <thead>
                                        <tr><th>Filename</th><th>Room</th><th></th></tr>
                                    </thead>
                                    <tbody>
                                        {files.map((files, index) =>
                                        <FileList
                                            removeFile={removeFile}
                                            key={index}
                                            filename={files.filename}
                                            room={files.room}
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