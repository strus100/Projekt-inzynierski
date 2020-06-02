import React, { useContext, useEffect, useState } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    const [URLtmp, setURLtmp] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const {admin} = useContext(AContext);

    useEffect(() => {
        var url = props.iframeURL;
        setURLtmp(url);
    }, []);

    const handleSetURLtmp = x =>{
        setURLtmp(x);
    }

    return(
        <div>
        <form className="form-iframe"> {/*później if admin*/} 
            <input type="text" 
                onChange={(e)=>handleSetURLtmp(e.target.value)}
                value={URLtmp}></input><br></br>
                <button 
                    type="submit" 
                    className="iframeurl--button"
                    onClick={(e)=>props.handleChangeURL(e, URLtmp)}
                    disabled={isButtonDisabled}
                    >
                    Change URL
                </button>
        </form>
        <div className="iframeURLinfo">
            <h1>{props.iframeURL}</h1>
        </div>
        { !admin ? 
            <div className="iframediv">
                <iframe id="scoreboard" scrolling="no" src={props.proxy + props.iframeURL} title="iframe-title"></iframe>
            </div>
            :
            <div className="iframediv">
                <iframe id="scoreboardx" scrolling="yes" src={props.proxy + props.iframeURL} title="iframe-title"></iframe>
            </div>
        }
        </div>
    )
} 

export default Iframe;