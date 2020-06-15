import React from 'react'

export default ({ name, permission, roomAdmin, changePermission }) =>
  <p>
    {roomAdmin && 
        <span>
            {permission ? <a onClick={() => changePermission(name)}>✔️</a> : <a onClick={() => changePermission(name)}>🚫</a>}</span>}
            <span> { name }</span>
  </p>