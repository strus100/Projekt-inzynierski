import React from 'react'

export default ({ name, permission, roomAdmin, login, changePermission, hand }) =>
  <p style={{display: "flex"}}>
    {roomAdmin && 
        <span>
            {permission ? 
            <span onClick={() => changePermission(login)}>
              <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">✔️</span>
            </span> : 
            <span onClick={() => changePermission(login)}><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">🚫</span></span>}</span>}
            <span style={{maxWidth: "80%", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: "14px", lineHeight: "25px", marginLeft: "5px"}} title={name}> { name }</span>
            {hand && <span className="material-icons" style={{color: "gold", fontSize: "16px", marginLeft: "auto", lineHeight: "25px", height: "25px"}}>pan_tool</span>}
  </p>