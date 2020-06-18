import React, { useEffect, useState } from 'react';
import './App.css'

function IframeInputAdmin(props){   
    const [URLtmp, setURLtmp] = useState('');

    useEffect(() => {
        var url = props.iframeURL;
        setURLtmp(url);
    }, []);

    var className = 'admin--iframe';

    if(props.checkedIframeInputAdmin){
        className += ' admin--iframe--active';
    }

    const handleSetURLtmp = x =>{
        setURLtmp(x);
    }

    return(
    <div className="iframeinputadmin">            
        <div className={className}>
            <form className="form-iframe"> {/*później if admin*/} 
                <input type="text" 
                    onChange={(e)=>handleSetURLtmp(e.target.value)}
                    value={URLtmp}></input><br></br>
                    <button 
                        type="submit" 
                        className="iframeurl--button"
                        onClick={(e)=>props.handleChangeURL(e, URLtmp)}
                        >
                        Change URL
                    </button>
            </form>
            <div id="drop-area">
                <form className="drop-form">
                    <input type="file" id="fileElem" multiple onChange={() => console.log("file")}></input>
                    <label className="filelabel" htmlFor="fileElem">Kliknij, aby wybrać plik lub upuść go tutaj</label>
                    <button onClick={() => console.log("confirmed")}>confirm</button>
                </form>
            </div>
        </div>
    </div>
    )
} 

export default IframeInputAdmin;