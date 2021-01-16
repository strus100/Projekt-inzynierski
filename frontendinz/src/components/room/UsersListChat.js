import React from 'react'

export default ({ name, permission, roomAdmin, login, changePermission, hand }) =>
  <p>
    {roomAdmin && 
        <span>
            {permission ? 
            <span onClick={() => changePermission(login)}>
              <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">✔️</span>
            </span> : 
            <span onClick={() => changePermission(login)}><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">🚫</span></span>}</span>}
            <span> { name }</span>
            {hand && <span>H</span>}
  </p>