import React, { useContext } from 'react';
import './App.css'
import {AContext} from "./AContext";

function Footer(props){
    const {admin} = useContext(AContext);

    return(
    <div className="footer">
        {props.lobby ?
        <div>
        {admin && <label 
        htmlFor="tooglemenu"
        onClick={(e) => props.handlePopupLobby(e)}
        style={{position: "absolute", left: 0+"px", width: 25+"%", borderRight: 1+"px solid #fff"}}
        ><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">Moje pliki</span></label>
        }
        <label 
        htmlFor="tooglemenu"
        onClick={() => props.handleLogout()}
        style={{position: "absolute", right: 0+"px",width: 25+"%", borderLeft: 1+"px solid #fff"}}
        ><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">Wyloguj</span></label>
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
                >
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
            >
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
            >
                <span aria-labelledby="jsx-a11y/accessible-emoji" role="img"><i className="material-icons">chat</i></span>
            </label>
            
        </div>
    }
    </div>
    )
} 

export default Footer;