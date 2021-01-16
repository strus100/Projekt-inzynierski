import React from 'react';
import '../../css/App.css';

function Iframe(props){
    return(
        <div>
            <div className="iframeURLinfo">
			{ props.roomAdmin ?
				<h1>{decodeURIComponent(props.iframeURLadmin)}</h1>
				:
                <h1>{decodeURIComponent(props.iframeURL)}</h1>
			}
            </div>
            { ! props.roomAdmin ? 
                <div className="iframediv">
                    <iframe id="scoreboard"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock"
                            scrolling="no" src={props.proxy + props.iframeURL}
                            title="iframe-title"></iframe>
                </div>
                :
                <div className="iframediv">
                    <iframe id="scoreboardx"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock"
                            scrolling="yes" src={props.proxy + props.iframeURL}
                            title="iframe-title"></iframe>
                </div>
            }
        </div>
    )
} 

export default Iframe;