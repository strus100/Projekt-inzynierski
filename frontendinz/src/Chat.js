import React, { Component } from 'react';
import './App.css'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {chat: ''};
        this.nickname = "";
      }
    
      
    componentDidMount() {
        this.getDataAxios()
        //this.timerID = setInterval(this.getDataAxios, 1000);
      }

    componentWillUnmount() {
        clearInterval(this.timerID);
      }

    async getDataAxios(){
        const response =
          await axios.get("https://randomuser.me/api");
        const user = response.data.results[0];
        console.log(user);
        this.nickname = user.name.first;
      }

    loadData(){
        console.log(1);
    }

    render(){
        let className = 'chat-activea';

        if(this.props.state.checkedChat){
            className += ' chat-active';
        }

        return(
        <div className={className}>            
            <div className="chat">
                <p id="name-area">Witaj {this.nickname}</p>
                
                <Tabs>
                <div className="chat-tabs">
                    <TabList>
                        <Tab>&#9776;</Tab>
                        <Tab><i class="material-icons">person</i></Tab>
                        <Tab>&#9851;</Tab>
                    </TabList>
                </div>
                <TabPanel>
                <div id="chat-wrap">
                    <div id="chat-area">
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                        <span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span></span><br></br>
                    </div>
                </div>
                </TabPanel>
                <TabPanel>
                <div className="wrap-users">
                    <div className="wrap-users-area">wrap-users-area</div>
                </div>
                </TabPanel>
                <TabPanel>
                <div className="wrap-additional">
                    <div className="wrap-additional-area">wrap-additional-area</div>
                </div>
                </TabPanel>
                </Tabs>
                <form id="send-message-area">
                    <textarea id="sendie" maxLength = '100' placeholder="Wyślij wiadomość"></textarea>
                </form>
            </div>
        </div>
        )
    }
} 

export default Chat;