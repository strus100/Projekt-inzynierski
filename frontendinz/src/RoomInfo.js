import React from 'react'

export default ({ id, name, surname, roomName }) =>
  <div className="responsive" title={roomName}>
    <a href={"/main/"+id} className="roominfo--item">
    <h2>{roomName}</h2>
    <h6>{name} {surname}</h6>
    </a>
  </div>
