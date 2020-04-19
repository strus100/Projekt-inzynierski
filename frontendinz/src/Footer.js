import React, { Component } from 'react';
import './App.css'

class Footer extends Component{
    constructor(props) {
        super(props);
      }
    
      


    render(){
        return(
        <div className="footer">
            <div>
                <label for="tooglemenu">&#9776;</label>
                        <input 
                            type="checkbox" 
                            id="tooglemenu"
                            checked={ this.props.state.checkedMenu } 
                            onChange={ this.props.handleChangeMenu } 
                            onClick={console.log( this.props.state.checkedMenu )}/>    
                <label for="tooglechat">&#128172;</label>
                        <input 
                            type="checkbox" 
                            id="tooglechat"
                            checked={ this.props.state.checkedChat } 
                            onChange={ this.props.handleChangeChat } 
                            onClick={console.log( this.props.state.checkedChat )}/>
            </div>
        </div>
        )
    }
} 

export default Footer;