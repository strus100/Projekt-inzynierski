import React, { useEffect, useState } from 'react';
import '../../css/App.css';

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
                        Zmień adres URL
                    </button>
            </form>
        </div>
    </div>
    )
} 

export default IframeInputAdmin;