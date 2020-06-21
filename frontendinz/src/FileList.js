import React from 'react'

export default ({ filename, room, removeFile }) =>
    <tr><td title={filename}>{filename}</td><td title={room}>{room}</td><td onClick={() => removeFile({filename})}>X</td></tr>