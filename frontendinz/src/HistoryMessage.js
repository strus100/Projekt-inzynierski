 import React from 'react'

export default ({ link, title, handleChangeURL }) =>
  <p>
    <span className="history-line" onClick={(e)=>handleChangeURL(e, link)}>
        Tytuł: {title}<br></br>
        <span>{link}</span>
    </span>
  </p>