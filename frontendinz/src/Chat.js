import React, { Component } from 'react';
import './App.css'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const URL = 'ws://localhost:1111';

class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: 'Bob',
            messages: [],
        }
        this.getDataAxios = this.getDataAxios.bind(this);
        this.ws = new WebSocket(URL);
      }
    
      componentDidMount() {
        this.ws.onopen = () => {
          console.log('connected')
        }
    
        this.ws.onmessage = evt => {
          const message = { type: "chat", chat: evt.data }
          this.addMessage(message)
        }
    
        this.ws.onclose = () => {
          console.log('disconnected')
          this.setState({
            ws: new WebSocket(URL),
          })
        }

        this.getDataAxios();
      }

    componentWillUnmount() {
        clearInterval(this.timerID);
      }

    async getDataAxios(){
        const response =
          await axios.get("https://randomuser.me/api");
        const user = response.data.results[0];
        console.log(user);
        this.setState({name: user.name.first});
      }

    addMessage = message =>
      this.setState(state => ({ messages: [message, ...state.messages] }))
  
    submitMessage = messageString => {
        const message = { type: "chat", chat: messageString }
        this.ws.send(JSON.stringify(message))
        this.addMessage(message)
        }

    createChat = () => {
        let chat = []
        for (let i = 0; i < 100; i++) {
            chat.push(<span className="chat-line"><span className="nickname">{this.nickname}</span>: <span className="message">aaa</span><br></br></span>)
          }
        return chat
      }

    render(){
        let className = 'chat-activea';

        if(this.props.checkedChat){
            className += ' chat-active';
        }

        return(
        <div className={className}>            
            <div className="chat">
                <p id="name-area">Witaj {this.state.name}</p>
                
                <Tabs>
                <div className="chat-tabs">
                    <TabList>
                        <Tab>&#9776;</Tab>
                        <Tab><i className="material-icons">person</i></Tab>
                        <Tab>&#9851;</Tab>
                    </TabList>
                </div>
                <TabPanel>
                <div id="chat-wrap">
                    <div id="chat-area">
                    {this.state.messages.map((message, index) =>
                        <ChatMessage
                            key={index}
                            message={message.chat}
                            //name={message.name} //dodane będzie jak będzie fix do jsona
                            name={this.state.name}
                        />,
                        )}
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
                <div id="send-message-area">
                <ChatInput
                    ws={this.ws}
                    onSubmitMessage={messageString => this.submitMessage(messageString)}
                    />
                </div>
            </div>
        </div>
        )
    }
} 

export default Chat;