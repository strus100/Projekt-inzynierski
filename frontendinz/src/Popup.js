import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css'

function Popup(props){   
    useEffect(() => {
        // When the user clicks on <span> (x), close the modal
        //document.getElementsByClassName("close")[0].onclick = function() {
            //document.getElementById("myModal").style.display = "none";
        //}
      
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == document.getElementById("myModal")) {
            document.getElementById("myModal").style.display = "none";
        }
      }
    }, [])

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
                            <form className="drop-form">
                                <input type="file" id="fileElem" multiple onChange={() => console.log("file")}></input>
                                <label className="filelabel" htmlFor="fileElem">Kliknij, aby wybrać plik lub upuść go tutaj</label>
                                <button onClick={() => console.log("confirmed")}>confirm</button>
                            </form>
                        </div>
                    </TabPanel>
                </Tabs>
                </div>
            </div>
        </div>         
    )
} 

export default Popup;