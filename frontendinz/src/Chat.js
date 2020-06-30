import React from 'react';
import './App.css'
import axios from 'axios'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import HistoryMessage from "./HistoryMessage"
import UsersListChat from "./UsersListChat"

const URL = 'ws://localhost:1111';

function Chat(props){

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

    if(props.roomAdmin){
        className += ' chat-admin';
    }

    return(
      <div className={className}>            
          <div className="chat">
            <p id="name-area">Witaj { props.name } { props.surname }</p>
              <Tabs>
                <div className="chat-tabs">
                    <TabList>
                        <Tab><i className="material-icons">chat</i></Tab>
                        <Tab><i className="material-icons">person</i></Tab>
                        {props.roomAdmin &&
                        <Tab><i className="material-icons">history</i></Tab>
                        }
                    </TabList>
                </div>
                <TabPanel>
                <div id="chat-wrap">
                    <div id="chat-area">
                    {this.state.messages.map((message, index) =>
                        <ChatMessage
                            key={index}
                            message={message.chat}
                            name={message.name}
                            messagetype={message.messagetype}
                        />,
                        )}
                    </div>
                </div>
                </TabPanel>
                <TabPanel>
                <div className="wrap-users">
                    <div className="wrap-users-area">
                        {props.usersList.map((usersList, index) =>
                        <UsersListChat
                            changePermission={props.changePermission}
                            key={index}
                            name={usersList.name}
                            permission={usersList.permission}
                            login={usersList.login}
                            roomAdmin={props.roomAdmin}
                        />,
                        )}
                        </div>
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