import React from 'react'
import {
  Link
} from "react-router-dom";

export default ({ id, name, surname, roomName, login, handlePopupQ }) =>
  <div className="container">
    <div className="card">
        <div className="circle"><h1>{id}</h1></div>
        <div className="content">
            <h4 title={name}>{name}</h4>
            <h2 title={surname}>{surname}</h2>
            <h5 title={login}>({login})</h5>
            <h6 title={roomName}>{roomName}</h6>
            <button onClick={e => handlePopupQ(id, name, surname, login, roomName, e)} className="enter_course">Przejdź do kursu</button>
        </div>
    </div>
  </div>