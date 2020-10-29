import React, { useContext } from 'react';
import './App.css'
import {AContext} from "./AContext";
import {
    Link
  } from "react-router-dom";

function Footer(props){
    const {admin} = useContext(AContext);

    return(
    <div className="footer">
        {props.lobby ?
        <div>
        {admin && <label 
        htmlFor="tooglemenu"
        onClick={(e) => props.handlePopupLobby(e)}
        className="tooltip footer--span-files"
        ><span className="tooltiptext tooltipfiles" style={{width: 150+"px", marginLeft: -5 + "%"}}>Przeglądaj pliki</span>
        <span aria-labelledby="jsx-a11y/accessible-emoji" role="img"><i className="material-icons">insert_drive_file</i></span></label>
        }

        
        <Link to="/"><label style={{width:"auto"}}><span class="material-icons footer--span-home">home</span></label></Link>
        

        <label 
        htmlFor="tooglemenu"
        onClick={() => props.handleLogout()}
        className="tooltip footer--span-logout"
        >{/*<span class="tooltiptext">Wyloguj się</span>*/}
        <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">WYLOGUJ</span></label>
        </div>
        :
        <div>        
            <input 
                type="checkbox" 
                id="tooglemenu"
                checked={ props.checkedMenu } 
                onChange={ props.handleChangeMenu } 
                />    
            <label 
                htmlFor="tooglemenu"
                onMouseEnter={() => props.handleHoverMenu(true)}
                onMouseLeave={() => props.handleHoverMenu(false)}
                className="tooltip footer--span-menu"
                style={{position:"absolute", left: 0}}
                >
                    <span className="tooltiptext">Menu</span>
                <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">&#9776;</span>
            </label>

            {props.roomAdmin &&
            <input 
                type="checkbox" 
                id="toogleiframeinputadmin"
                checked={ props.checkedIframeInputAdmin } 
                onChange={ props.handleChangeIframeInputAdmin } 
                />
            }
            {props.roomAdmin &&
            <label 
                htmlFor="toogleiframeinputadmin"
                className="tooltip footer--span-http"
            >
                <span className="tooltiptext">URL</span>
                <span aria-labelledby="jsx-a11y/accessible-emoji" role="img"><i className="material-icons">http</i></span></label>
            }

            <input 
                type="checkbox" 
                id="tooglechat"
                checked={ props.checkedChat } 
                onChange={ props.handleChangeChat } 
                />
            <label 
                htmlFor="tooglechat"
                onMouseEnter={() => props.handleHoverChat(true)}
                onMouseLeave={() => props.handleHoverChat(false)}
                className="tooltip footer--span-chat"
                style={{position:"absolute", right: 0}}
            >
                <span className="tooltiptext">Chat</span>
                <span aria-labelledby="jsx-a11y/accessible-emoji" role="img"><i className="material-icons">chat</i></span>
            </label>
            
        </div>
    }
    </div>
    )
} 

export default Footer;