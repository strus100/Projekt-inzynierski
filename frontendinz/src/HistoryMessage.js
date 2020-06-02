 import React from 'react'

export default ({ link, title, handleChangeURL }) =>
  <p>
    <span className="history-line" onClick={(e)=>handleChangeURL(e, link)}>
        <a>Title: {title}</a><br></br>
        <span><a>{link}</a></span>
    </span>
  </p>