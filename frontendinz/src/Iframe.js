import React, { useContext, useEffect } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    const {admin} = useContext(AContext);

    return(
        <div>
        { !admin ? 
            <div className="iframediv">
                <div id="framearea">
                    <iframe id="scoreboard" scrolling="no" src="https://www.wmi.amu.edu.pl/"></iframe>
                </div>
                <div id="framecover">
                    <img src="dot.gif"/>
                </div>
            </div>
            :
            <div className="iframediv">
                <iframe id="scoreboardx" src="https://www.wmi.amu.edu.pl/"></iframe>
            </div>
        }
        </div>
    )
} 

export default Iframe;