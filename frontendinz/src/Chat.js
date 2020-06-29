import React from 'react';
import './App.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import HistoryMessage from "./HistoryMessage"
import UsersListChat from "./UsersListChat"


function Chat(props){

    let className = 'chat-activea';

    if(props.checkedChat){
        className += ' chat-active';
    }

    if(props.hoverChat && !props.checkedChat){
        className += ' chat-hover';
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
                    {props.messages.map((message, index) =>
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
                {props.roomAdmin &&
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
                }
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