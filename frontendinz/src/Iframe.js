import React, { useContext, useEffect } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    const {admin} = useContext(AContext);

    return(
        <div>
        { !admin ? 
            <div className="iframediv">
                <iframe id="scoreboard" scrolling="no" src="https://www.wmi.amu.edu.pl/"></iframe>
            </div>
            :
            <div className="iframediv">
                <iframe id="scoreboardx" scrolling="yes" src="https://www.wmi.amu.edu.pl/"></iframe>
            </div>
        }
        </div>
    )
} 

export default Iframe;