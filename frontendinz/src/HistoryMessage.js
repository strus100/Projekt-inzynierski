 import React from 'react'

export default ({ link, title }) =>
  <p>
    <span className="history-line">
        <a href={link}>Title: {title}</a><br></br>
        <span><a href={link}>{link}</a></span>
    </span>
  </p>