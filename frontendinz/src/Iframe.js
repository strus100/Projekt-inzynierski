import React, { useContext, useEffect, useState } from 'react';
import {AContext} from "./AContext"
import './App.css'

function Iframe(props){
    
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const {admin} = useContext(AContext);

    return(
        <div>
            <div className="iframeURLinfo">
			{admin ?
				<h1>{props.iframeURLadmin}</h1>
				:
				<h1>{props.iframeURL}</h1>
			}
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