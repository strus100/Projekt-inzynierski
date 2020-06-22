import React from 'react'

export default ({ filename, room, link, removeFile, handleChangeURL }) =>
    <tr>
        <td title={filename}>{filename}</td><td title={room}>{room}</td>
        <td><span  onClick={(e) => handleChangeURL(e, link)} title="Kliknij, aby przejść do strony">{link}</span></td>
        <td><span onClick={() => removeFile({filename})}>X</span></td>
    </tr>