import React from 'react'

export default ({ name, message, messagetype }) =>
  <p>
    {messagetype !== "code" ?
    <span className="chat-line"><span className="nickname">{name}</span>: <span className="message">{message}</span></span>
    :
    <span className="chat-line"><span className="nickname">{name}</span> <span className="message">:<br></br>
      <details>
        <summary>Rozwiń kod</summary>
        <pre>{message}</pre>
      </details>
      </span></span>
    }
  </p>