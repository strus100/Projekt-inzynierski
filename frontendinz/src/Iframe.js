import React, { useContext } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    const {admin} = useContext(AContext);
    return(
        <div>
        { !admin ? 
            <div className="iframediv">
                <iframe id="scoreboard" scrolling="no" src="http://localhost/proxy?url=http://wmi.amu.edu.pl" title="iframe-title"></iframe>
            </div>
            :
            <div className="iframediv">
                <iframe id="scoreboardx" scrolling="yes" src="http://localhost/proxy?url=http://wmi.amu.edu.pl" title="iframe-title"></iframe>
            </div>
        }
        </div>
    )
} 

export default Iframe;