 import React from 'react'

export default ({ link, title, date, handleChangeURL }) =>
  <p>
    <span className="history-line" onClick={(e)=>handleChangeURL(e, link)} title={link}>
        <span>[{title}]</span><br></br>
        {link}<br></br>
    </span>
  </p>