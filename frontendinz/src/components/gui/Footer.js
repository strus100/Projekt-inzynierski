import React, { useContext, useState, useEffect } from 'react';
import '../../css/App.css'
import {AContext} from "../../context/AContext";
import {
    Link
  } from "react-router-dom";

function Footer(props){
    const {admin} = useContext(AContext);
    const {login} = useContext(AContext);
    const [linkPawel, setLinkPawel] = useState("https://pomocnikprofesora.herokuapp.com/");
    //https://pomocnikprofesora.herokuapp.com/resultsStudent?login=student1
    const [postPawel, setPostPawel] = useState(true);

    useEffect(() => {
        window.addEventListener('click', function(event) {
          if (event.target === document.getElementById("form-consultation-a") || event.target === document.getElementById("form-consultation-a--icon")) {
              document.getElementById("form-consultation").submit();
          }
        }
        )
        
      }, [])

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
        {(!admin && !postPawel) && <a href={linkPawel+"resultsStudent?login="+login} target="_blank"><label 
        htmlFor="tooglepawel"
        className="tooltip footer--span-files"
        ><span className="tooltiptext tooltipfiles" style={{width: 150+"px", marginLeft: -5 + "%"}}>Moje dyżury</span>
        <span aria-labelledby="jsx-a11y/accessible-emoji" role="img"><i className="material-icons">question_answer</i></span></label></a>
        }

        {(!admin && postPawel) &&
            <form method="post" action={linkPawel+"resultsStudent"} target="_blank" style={{width: "60px"}} id="form-consultation">
            <input type="text" style={{display: "none"}} id="login" name="login" value={props.login}/>
            <a>
                <label 
                    id="form-consultation-a"
                    className="tooltip footer--span-files"
                >
                    <span className="tooltiptext tooltipfiles" style={{width: 150+"px", marginLeft: -5 + "%"}}>Moje dyżury</span>
                    <span aria-labelledby="jsx-a11y/accessible-emoji" role="img"><i className="material-icons" id="form-consultation-a--icon">question_answer</i></span>
                </label>
            </a>
        </form>
        }

        
            <Link to="/">
                <label 
                    htmlFor="homebutton"
                    className="tooltip footer--span-home"
                >
                    <span className="tooltiptext">Powrót do strony głównej</span>
                    <span className="material-icons">home</span>
                </label>
            </Link>
        

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
            {(!props.roomAdmin && !postPawel) &&
                <a href={linkPawel+"zapisy?roomId="+props.id+"&login="+props.login} target="_blank"><label
                    className="tooltip footer--span-consultation"
                >
                <span className="tooltiptext tooltiptext--long">Umów się na konsultację z {props.adminName}</span>
                <span class="material-icons">
                question_answer
                </span></label>
                </a>
            }

            {(!props.roomAdmin && postPawel) &&
                <form method="post" action={linkPawel+"zapisy"} target="_blank" style={{width: "60px"}} id="form-consultation">
                <input type="text" style={{display: "none"}} id="roomId" name="roomId" value={props.id}/>
                <input type="text" style={{display: "none"}} id="login" name="login" value={props.login}/>
                <a>
                <label
                    id="form-consultation-a"
                    className="tooltip footer--span-consultation"
                >
                <span className="tooltiptext tooltiptext--long">Umów się na konsultację z {props.adminName}</span>
                <span class="material-icons" id="form-consultation-a--icon">
                question_answer
                </span></label></a>
                </form>
            }

            {(props.roomAdmin && !postPawel)&&
                <a href={linkPawel+"dashboardTeacher?roomId="+props.id} target="_blank"><label
                    className="tooltip footer--span-consultation"
                >
                <span className="tooltiptext tooltiptext--long">Moje konsultacje</span>
                <span class="material-icons">
                question_answer
                </span></label>
                </a>
            }

            {(props.roomAdmin && postPawel) &&
                <form method="post" action={linkPawel+"dashboardTeacher"} target="_blank" style={{width: "60px"}} id="form-consultation">
                    <input type="text" style={{display: "none"}} id="roomId" name="roomId" value={props.id}/>
                    <a>
                    <label
                        id="form-consultation-a"
                        className="tooltip footer--span-consultation"
                    >
                        <span className="tooltiptext tooltiptext--long">Moje konsultacje</span>
                        <span class="material-icons" id="form-consultation-a--icon">
                            question_answer
                        </span>
                    </label>
                    </a>
                </form>
            }

            <input 
                type="checkbox" 
                id="homebutton"
                />

            <Link to="/">
                <label 
                    htmlFor="homebutton"
                    className="tooltip footer--span-home"
                >
                    <span className="tooltiptext">Powrót do strony głównej</span>
                    <span className="material-icons">home</span>
                </label>
            </Link>

            {!props.roomAdmin &&
                <a className="footer--span-lapka" onClick={() => props.handleRaiseHand()}><label
                    className="tooltip"
                >
                <span className="tooltiptext">Zgłoś się</span>
                <span className="material-icons" style={{padding: "0 25px"}}>pan_tool</span></label>
                </a>
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