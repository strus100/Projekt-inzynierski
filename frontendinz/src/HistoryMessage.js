 import React from 'react'

export default ({ link, title }) =>
  <p>
    <span className="history-line">
        <a href={link}>Title: {title}</a><br></br>
        <span>Link: {link}</span>
    </span>
  </p>