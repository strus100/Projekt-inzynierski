import React from 'react';

export default ({name, surname, role}) =>
        <div className="main--card">
            <div className="main--card-image"></div>
            <div className="main--card-text">
                <h2>{name}</h2>
                <h2>{surname}</h2>
                <h3>{role}</h3>
            </div>
        </div>