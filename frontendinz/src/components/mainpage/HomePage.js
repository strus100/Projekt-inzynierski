import React, {useState, useEffect, useContext} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import '../../css/App.css'
import AboutCards from './components/AboutCards';
import AboutCardsWrapper from './components/AboutCardsWrapper';
import HomepageMenu from './components/HomepageMenu';
import HomepageMenuLogged from './components/HomepageMenuLogged';
import MainPageSection from './components/MainPageSection';
import ParallaxContainer from './components/ParallaxContainer';
import TechCards from './components/TechCards';
import TechCardsWrapper from './components/TechCardsWrapper';

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

  useEffect(() => {
	  window.scrollTo(0,0);
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
              <HomepageMenuLogged logout={props.handleLogout}/>
              :
              <HomepageMenu/>
            }
          </nav>

          <ParallaxContainer classAdditional="parallax1" id="section--start">
            <h1 className="header--main">Wykłady Webowe</h1>
          </ParallaxContainer>

          <MainPageSection id="section--onas">
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
          </MainPageSection>

          <ParallaxContainer classAdditional="parallax2" id="particles-js"/>

          <MainPageSection id="section--2">
            <h1 style={{textTransform: "uppercase", textAlign: "center"}}>Architektura systemu</h1>
            <TechCardsWrapper>
                  <TechCards text="Websockety"/>
                  <TechCards text="ReactJS"/>
                  <TechCards text="PHP"/>
                  <TechCards text="WebRTC"/>
                  <TechCards text="SQL"/>
            </TechCardsWrapper>
          </MainPageSection>  

          <ParallaxContainer classAdditional="parallax3"/>

          <MainPageSection id="section--3">
            <h1 style={{textTransform: "uppercase", textAlign: "center"}}>Nasz zespół</h1>

            <AboutCardsWrapper>
                  <AboutCards name="Radosław" surname="Fiweg" role="Backend"/>
                  <AboutCards name="Dawid" surname="Krause" role="Frontend"/>
                  <AboutCards name="Daniel" surname="Matuszewski" role="Backend"/>
                  <AboutCards name="Paweł" surname="Rozpłochowski" role="Podwykonawca"/>
            </AboutCardsWrapper>

          </MainPageSection>

          <ParallaxContainer classAdditional="parallax4"/>

          <div id="main--footer">Wykłady Webowe 2020 - </div>
        </div>
      )
} 

export default HomePage;
