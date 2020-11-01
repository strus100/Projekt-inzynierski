import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import './App.css'
import lobby_tutorial_1 from "./img/lobby_tutorial_1.png";
import lobby_tutorial_2 from "./img/lobby_tutorial_2.png";

function FAQ(props){   

    useEffect(() => {
        var acc = document.getElementsByClassName("faq--button-accordion");
        var i;
    
        for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("accordion--button-active");
    
            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (panel.style.display === "flex") {
            panel.style.display = "none";
            } else {
            panel.style.display = "flex";
            }
        });
        }
    }, [])

        return(
            <div className="faq--div-main">
                <div className="faq--div-container">
                    <button className="faq--button-accordion">Jak korzystać z pokoju?</button>
                    <div className="faq--panel-accordion">
                        <div className="faq--panel-accordion-container">
                            <p>Widok pokoju z zamkniętymi kartami:</p>
                            <img className="faq--image" src={lobby_tutorial_1}/>
                            <p>
                                Otwórz Menu - pozwala na otwarcie karty Menu z lewej strony.<br/>
                                Edycja URL - pozwala na otwarcie karty URL z góry, jest to przycisk widoczny tylko dla administratora pokoju, pozwala on na zmianę adresu URL strony, która obecnie jest wyświetlana w pokoju.<br/>
                                Otwórz Chat - pozwala na otwarcie karty Chatu z prawej strony.<br/>
                                </p><br/><br/><br/>
                            <p>Widok pokoju z otwartymi kartami:</p>
                            <img className="faq--image" src={lobby_tutorial_2}/>
                        </div>
                    </div>

                    <button className="faq--button-accordion">Komendy dostępne na chatcie.</button>
                    <div className="faq--panel-accordion">
                        <div className="faq--panel-accordion-container">
                            Komendy dostępne na czacie: <br/><br/>
                            /c tekst -> Wyświetla tekst jako kod<br/><br/>
                            /pomoc (alias: /h, /help) -> Wyświetla pomoc<br/><br/>
                            //tekst -> pozwala na wypisanie wiadomości, która zaczyna się od '/' na czacie (nie będzie traktowana jako komenda), przykładowo '//c tekst' wypisze '/c tekst'
                        </div>
                    </div>
                </div>
            </div>
        )
} 

export default FAQ;
