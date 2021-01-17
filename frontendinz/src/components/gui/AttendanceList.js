import React from 'react'

export default ({ getList, deleteList, id, name, date }) =>
    <tr>
        <td>{id}</td>
        <td>{date}</td>
        <td onClick={(e) => getList(e, date, name)}>{name}</td>
        <td onClick={() => deleteList(name)}>X</td>
        
    </tr>