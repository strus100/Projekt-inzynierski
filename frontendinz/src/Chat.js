import React, { useContext } from 'react';
import './App.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import HistoryMessage from "./HistoryMessage"
import {AContext} from "./AContext"


function Chat(props){
    const {admin} = useContext(AContext);

    let className = 'chat-activea';

    if(props.checkedChat){
        className += ' chat-active';
    }

    if(props.hoverChat && !props.checkedChat){
        className += ' chat-hover';
    }

    return(
      <div className={className}>            
          <div className="chat">
              <p id="name-area">Witaj { props.name }</p>
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
                    {props.messages.map((message, index) =>
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
                    <div className="wrap-additional-area">
                    {props.historyB.map((historyB, index) =>
                        <HistoryMessage
                            key={index}
                            title={historyB.title}
                            link={historyB.link}
                            handleChangeURL={props.handleChangeURL}
                        />,
                        )}
                    </div>
                </div>
                </TabPanel>
              </Tabs>
              <div id="send-message-area">
              <ChatInput
                  ws={props.ws}
                  onSubmitMessage={messageString => props.submitMessage(messageString)}
                  />
              </div>
          </div>
      </div>
      )
  }

export default Chat;