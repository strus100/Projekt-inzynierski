import React from 'react'

export default ({ name, message, messagetype }) =>
  <p>
    {messagetype !== "code" ?
    <span className="chat-line"><span className="nickname">{name}</span>: <span className="message">{message}</span></span>
    :
    <span className="chat-line"><span className="nickname">{name}</span> <span className="message">**code**: <pre>{message}</pre></span></span>
    }
  </p>