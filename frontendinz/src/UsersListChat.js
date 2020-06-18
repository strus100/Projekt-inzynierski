import React from 'react'

export default ({ name, permission, roomAdmin, changePermission }) =>
  <p>
    {roomAdmin && 
        <span>
            {permission ? <span onClick={() => changePermission(name)}><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">✔️</span></span> : <span onClick={() => changePermission(name)}><span aria-labelledby="jsx-a11y/accessible-emoji" role="img">🚫</span></span>}</span>}
            <span> { name }</span>
  </p>