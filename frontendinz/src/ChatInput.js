import React, { useState } from 'react'

function ChatInput(props){
  const [message, setMessage] = useState("");

  return (
    <form
      action="."
      onSubmit={e => {
        e.preventDefault()
        props.onSubmitMessage(message)
        setMessage('')
      }}
    >
      <div className="textarea-wrapper">
        <textarea
          type="text"
          placeholder={'Wpisz wiadomość...'}
          id="sendie"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div> 
      <input id="chat-button" type="submit" value={'Wyślij'} />
    </form>
  )
}

export default ChatInput