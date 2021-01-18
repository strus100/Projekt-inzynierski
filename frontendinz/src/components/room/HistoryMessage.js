 import React from 'react'

export default ({ link, title, date, handleChangeURL }) =>
  <p>
    <span className="history-line" onClick={(e)=>handleChangeURL(e, link)} title={link}>
        <span>[{date}]</span><br></br>
        {title}<br></br>
    </span>
  </p>