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
      <input
        type="text"
        placeholder={'Enter message...'}
        id="sendie"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <input id="chat-button" type="submit" value={'Send'} />
    </form>
  )
}

export default ChatInput