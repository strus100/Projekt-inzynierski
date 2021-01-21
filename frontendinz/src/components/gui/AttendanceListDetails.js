import React from 'react'

export default ({ name, surname, login }) =>
    <tr>
        <td>{login}</td>
        <td>{name}</td>
        <td>{surname}</td>
    </tr>