import React from 'react'

export default ({ name, message }) =>
  <p>
    <span className="chat-line"><span className="nickname">{name}</span>: <span className="message">{message}</span></span>
  </p>