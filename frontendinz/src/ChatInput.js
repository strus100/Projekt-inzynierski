import React, { useState, useEffect } from 'react'

function ChatInput(props){
  const [message, setMessage] = useState("");

  useEffect(() => {
    function submitOnEnter(event){
      if(event.which === 13 && !event.shiftKey){
          event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
          event.preventDefault();
        }
      }
  
      document.getElementById("sendie").addEventListener("keypress", submitOnEnter);

  return () => {
    document.getElementById("sendie").removeEventListener("keypress", submitOnEnter);
    };

  }, [])

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