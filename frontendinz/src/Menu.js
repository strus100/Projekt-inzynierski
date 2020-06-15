import React from 'react';
import './App.css'

function Menu(props){   
        var className = 'menu-activea';

        if(props.checkedMenu){
            className += ' menu-active';
        }

        return(
        <div className="menu">            
            <nav className={className}>
                <ul>
                    <a href="#"><li>HOME</li></a>
                    <a href="#section1"><li>Section I</li></a>
                    <a href="#section2"><li>Section II</li></a>
                </ul>
            </nav>
        </div>
        )
} 

export default Menu;