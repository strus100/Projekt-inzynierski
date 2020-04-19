import React, { Component } from 'react';
import './App.css'

class Menu extends Component{
    constructor(props) {
        super(props);
      }
    
    render(){
        let className = 'menu-activea';

        if(this.props.state.checkedMenu){
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
} 

export default Menu;