import React, {useState, useEffect, useContext} from 'react';
import { AContext } from "./AContext"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css'

function HomePage(props){
  const [cn, setCn] = useState("main--navbar-fixed");
  const [styleUl, setStyleUl] = useState("");
  var cntWd, sldWd, tb;

  useEffect(() =>{
    //window.addEventListener('wheel', scrollOnHomepage); /*czemu to dodałem? już wiem ale to trzeba zmienić*/
    window.addEventListener('click', scrollOnHomepage);
    window.addEventListener('scroll', scrollOnHomepage);
    window.addEventListener('wheel', removeMenuOnScroll);
    //document.getElementById("main--container-slider").addEventListener("mousemove", handleSlider);
  
      return () => {
        //window.removeEventListener('wheel', scrollOnHomepage);
        window.removeEventListener('click', scrollOnHomepage);
        window.removeEventListener('scroll', scrollOnHomepage);
        window.removeEventListener('wheel', removeMenuOnScroll);
        //document.getElementById("main--container-slider").removeEventListener("mousemove", handleSlider);
    };
  }, [])
  
  function handleSlider(e){
		cntWd = document.getElementById("main--container-slider").clientWidth;
		tb = document.getElementById("thumbs");
		sldWd = tb.clientWidth;
		document.getElementById("thumbs").style.left = ((cntWd - sldWd)*((e.pageX / cntWd).toFixed(3))).toFixed(1) +"px";
  }

  function scrollOnHomepage(){
    //console.log(window.scrollY);
    if(window.scrollY > 0 || window.pageYOffset > 0){
      setCn("main--navbar-fixed main--navbar-scrolled");
    }
    else{
      setCn("main--navbar-fixed");
    }
  }

  function removeMenuOnScroll(){
    document.getElementById("mainpage--checkbox").checked = false;
    setStyleUl("");
  }

  function handleCheckbox(){
    if(document.getElementById("mainpage--checkbox").checked){
      setStyleUl("main--navbar-open");
    }else{
      setStyleUl("");
    }
  }
   
      return(
        <div className="main--page" id="homepage">
          <input type="checkbox" id="mainpage--checkbox" onClick={() => handleCheckbox()}></input>
          <label htmlFor="mainpage--checkbox"><span className="main--span-labeled"></span></label>
          <nav className={cn + " " + styleUl}>
          {props.authenticated ?
            <ul>
              <li>
                <a href="#section--start">Strona Główna</a>
              </li>
              <li>
                <a href="#section--onas">O projekcie</a>
              </li>
              <li>
                <a href="#section--2">Architektura</a>
              </li>
              <li>
                <Link to="/lobby">Lobby</Link>
              </li>
              <li>
                <a onClick={() => props.handleLogout()}>Wyloguj</a>
              </li>
            </ul>
            :
            <ul>
              <li>
                <a href="#section--start">Strona Główna</a>
              </li>
              <li>
                <a href="#section--onas">O nas</a>
              </li>
              <li>
                <a href="#section--2">ARCHITEKTURA</a>
              </li>
              <li>
                <Link to="/login">login</Link>
              </li>
            </ul>
          }
        </nav>
          <div className="parallax-container parallax1" id="section--start"><h1 className="header--main">Wykłady Webowe</h1></div>
          <div className="main--section" id="section--onas">
              <h1 style={{textTransform: "uppercase", textAlign: "center"}}>O Wykładach Webowych</h1>
              <p>Aplikacja "Wykłady Webowe" pozwala na przeprowadzanie zajęć lub prezentacji online bez konieczności instalacji dodatkowego oprogramowania.</p>
              <p>Nasza aplikacja cechuje się niskim obciążeniem sieci, w przypadku znanych rozwiązań przeprowadzenie prezentacji online jest to proces, w którym użytkownik
                udostępnia swój ekran, a następnie pozostali członkowie odbierają jego obraz w postaci wideo, co w przypadku słabego połączenia internetowego może skutkować zamazanym bądź też słabo widocznym obrazem. Nasz produkt pozwala na przedstawienie swojej prezentacji bez konieczności
                wysyłania wideo, słuchacze otrzymują tylko informację o tym, w którym momencie prezentacji jest aktualnie osoba zarządzająca swoim pokojem i automatycznie
                przemieszczana w to miejsce.</p> 
                <p>Osoba zarządzająca pokojem ma również możliwość korzystania z komunikacji głosowej, która odbywa się w tylko jedną stronę: od prowadzącego do użytkownika.</p> 
                <p>Do komunikacji pozostałych osób z osobą prowadzącą mogą służyć indywidualne dla każdego pokoju chaty tekstowe.</p> 
                <p>Aplikacja ta pozwala również na tworzenie swoich własych pokoi w nieograniczonej liczbie.</p> 
                <a href="https://github.com/strus100/Projekt-inzynierski" id="main--a" target="_blank">Strona projektu</a>
              </div>
          <div className="parallax-container parallax2" id="particles-js"></div>
          <div className="main--section" id="section--2">
          <h1 style={{textTransform: "uppercase", textAlign: "center"}}>Architektura systemu</h1>
          <div className="main--wrapper-grid-technology">
          <div className="main--wrapper-card-technology">
               <div className="main--card-technology">
                    <div className="main--card-image-technology"></div>
                    <div className="main--card-text-technology">
                      <h2>Websockety</h2>
                    </div>
                </div>
                <div className="main--card-technology">
                    <div className="main--card-image-technology"></div>
                    <div className="main--card-text-technology">
                      <h2>ReactJS</h2>
                    </div>
                </div>
                <div className="main--card-technology">
                    <div className="main--card-image-technology"></div>
                    <div className="main--card-text-technology">
                      <h2>PHP</h2>
                    </div>
                </div>
                <div className="main--card-technology">
                    <div className="main--card-image-technology"></div>
                    <div className="main--card-text-technology">
                      <h2>WebRTC</h2>
                    </div>
                </div>
                <div className="main--card-technology">
                    <div className="main--card-image-technology"></div>
                    <div className="main--card-text-technology">
                      <h2>SQL</h2>
                    </div>
                </div>
                </div>
          </div></div>
          <div className="parallax-container parallax3"></div>
          <div className="main--section" id="section--3">
            <h1 style={{textTransform: "uppercase", textAlign: "center"}}>Nasz zespół</h1>
            <div id="main--container-slider">
                <div id="thumbs">
                  <div className="main--card">
                    <div className="main--card-image"></div>
                    <div className="main--card-text">
                      <h2>Radosław</h2>
                      <h2>Fiweg</h2>
                      <h3>Backend</h3>
                    </div>
                  </div>
                  <div className="main--card">
                    <div className="main--card-image"></div>
                    <div className="main--card-text">
                      <h2>Dawid</h2>
                      <h2>Krause</h2>
                      <h3>Frontend</h3>
                    </div>
                  </div>
                  <div className="main--card">
                    <div className="main--card-image"></div>
                    <div className="main--card-text">
                      <h2>Daniel</h2>
                      <h2>Matuszewski</h2>
                      <h3>Backend</h3>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div className="parallax-container parallax4"></div>
          <div id="main--footer">Wykłady Webowe 2020 - </div>
        </div>
      )
} 

export default HomePage;
