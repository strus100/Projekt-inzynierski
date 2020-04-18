import React, { Component } from 'react';
import './App.css'

class Chat extends Component{
    constructor(props) {
        super(props);
      }
    
      


    render(){
        let className = 'chat-activea';

        if(this.props.state.checkedChat){
            className += ' chat-active';
        }

        return(
        <div className={className}>            
            <div>
                <p>Chat</p>
            </div>
        </div>
        )
    }
} 

export default Chat;