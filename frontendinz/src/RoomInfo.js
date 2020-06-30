import React from 'react'
import {
  Link
} from "react-router-dom";

export default ({ id, name, surname, roomName }) =>
  <div className="responsive" title={roomName}>
    <Link to={"/main/"+id} className="roominfo--item">
    <h2>{roomName}</h2>
    <h6>{name} {surname}</h6>
    </Link>
  </div>
