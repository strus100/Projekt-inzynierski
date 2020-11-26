import React, { Children } from 'react';

function MainPageSection(props){
    return(
        <div className="main--section" id={props.id}>
            {props.children}
        </div>
    )
}

export default MainPageSection;