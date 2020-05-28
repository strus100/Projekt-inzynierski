import React, { useContext } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    const {admin} = useContext(AContext);

    return(
        <div>
        { !admin ? 
            <div className="iframediv">
                <iframe id="scoreboard" scrolling="no" src="" title="iframe-title"></iframe>
            </div>
            :
            <div className="iframediv">
                <iframe id="scoreboardx" scrolling="yes" src="" title="iframe-title"></iframe>
            </div>
        }
        </div>
    )
} 

export default Iframe;