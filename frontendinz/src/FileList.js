import React from 'react'

export default ({ filename, room, link, removeFile, handleChangeURL }) =>
    <tr><td title={filename}>{filename}</td><td title={room}>{room}</td><td onClick={(e) => handleChangeURL(e, link)} title="Kliknij, aby przejść do strony">{link}</td><td onClick={() => removeFile({filename})}>X</td></tr>