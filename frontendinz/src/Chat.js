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
            ws: null,
        }
        this.getDataAxios = this.getDataAxios.bind(this);

        this.timeout = 1000;
      }
    
    componentDidMount() {       
        this.connect();
        this.getDataAxios();
        
      }

    componentWillUnmount() {
        //clearInterval(this.timerID);
      }

    connect = () => {
      var ws = new WebSocket(URL);
      var connectInterval;

      ws.onopen = () => {
        console.log('connected');
        ws.send("1");
        this.setState({ws: ws});
        clearTimeout(connectInterval);
      };

      ws.onmessage = evt => {
        const message = evt.data
        this.addMessage(JSON.parse(message))
      };
  
      ws.onclose = e => {
        console.log(
            `Socket is closed. Reconnect will be attempted in ${Math.min(
                10000 / 1000,
                (this.timeout + this.timeout) / 1000
            )} second.`,
            e.reason
        );

        this.timeout = this.timeout + this.timeout;
        connectInterval = setTimeout(this.check, Math.min(10000, this.timeout));
      };

      ws.onerror = err => {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );

        ws.close();
      };
    }

    check = () => {
      const { ws } = this.state;
      if (!ws || ws.readyState == WebSocket.CLOSED) this.connect();
    };

    async getDataAxios(){
        const response =
          await axios.get("https://randomuser.me/api");
        const user = response.data.results[0];
        console.log(user);
        this.setState({name: user.name.first});
      }

    addMessage = message => {
        this.setState(state => ({ messages: [message, ...state.messages] }))
        }
  
    submitMessage = messageString => {
          if(this.state.ws != null){
            if(this.state.ws.readyState === 1){
              if( messageString !== ""){
                const message = { type: "chat", chat: messageString, name: this.state.name }
                this.state.ws.send(JSON.stringify(message))
                this.addMessage(message)
                console.log(this.state.ws.readyState)
                console.log(this.state.user)
              }
            }
            else{
              this.addMessage({ type: "chat", chat: "Nie połączono z chatem", name: "SERVER" })
            }
          }
          else{
            this.addMessage({ type: "chat", chat: "Nie połączono z chatem", name: "SERVER"  })
          }
        }

    createChat = () => { //chwilowo niepotrzebne
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

        if(this.state.ws === null){
            className += ' chat-disabled';
          }else{
            //console.log(this.state.ws.readyState)
            if(this.state.ws.readyState != 1){
              className += ' chat-disabled';
          }
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
                            name={message.name} //dodane
                            //name={this.state.name}
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