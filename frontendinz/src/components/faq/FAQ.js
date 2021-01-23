import React, { useEffect } from 'react';
import '../../css/App.css'
import lobby_tutorial_1 from "../../img/lobby_tutorial_1.png";
import lobby_tutorial_2 from "../../img/lobby_tutorial_2.png";
import AccordionBody from './Accordion/AccordionBody';
import AccordionHeader from './Accordion/AccordionHeader';
import AccordionIMG from './Accordion/AccordionIMG';
import AccordionP from './Accordion/AccordionP';
import instrukcja from "../../pdf/WebWyklady_PomocnikProfesora_InstrukcjaUzytkownika.pdf"

function FAQ(props){   

    useEffect(() => {
        var acc = document.getElementsByClassName("faq--button-accordion");
        var i;
    
        for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("accordion--button-active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "flex") {
            panel.style.display = "none";
            } else {
            panel.style.display = "flex";
            }
        });
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0,0);
    }, [])

        return(
            <div className="faq--div-main">
                <div className="faq--div-container">

                    <AccordionHeader title="Jak korzystać z aplikacji?"/>
                    <AccordionBody style={{width: "100%", height: "600px"}}>
                        <iframe style={{width: "100%", height: "100%"}} src={instrukcja}/>
                    </AccordionBody>

                    <AccordionHeader title="Komendy dostępne na chatcie."/>
                    <AccordionBody>
                        <AccordionP text="Komendy dostępne na czacie: <br/><br/>/c tekst -> Wyświetla tekst jako kod<br/><br/>/pomoc (alias: /h, /help) ->  Wyświetla pomoc<br/><br/>//tekst ->  pozwala na wypisanie wiadomości, która zaczyna się od '/' na czacie (nie będzie traktowana jako komenda), przykładowo '//c tekst' wypisze '/c tekst'"/>
                    </AccordionBody>

                </div>
            </div>
        )
} 

export default FAQ;
