import React, { useContext } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    const {admin} = useContext(AContext);
    return(
        <div>
        <form>
            <input type="text" 
                onChange={(e)=>props.handleChangeURL(e.target.value)}
                value={props.iframeURL}></input>
        </form>
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