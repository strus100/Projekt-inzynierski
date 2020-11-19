import React from 'react'

export default ({ name, locationx, id, removeFile, handleChangeURL, fromMain }) =>
    <tr>
        <td>{id}</td>
        {fromMain && 
            <td title={name}>
            <span 
            onClick={(e) => handleChangeURL(e, window.location.origin+locationx)} 
            title="Kliknij, aby przejść do strony" style={{cursor: "pointer"}}>{name}
            </span></td>
        }
        {!fromMain && 
            <td title={name}><span>{name}</span></td>
        }
        <td><span onClick={() => removeFile(name)} style={{cursor: "pointer"}}>X</span></td>
    </tr>