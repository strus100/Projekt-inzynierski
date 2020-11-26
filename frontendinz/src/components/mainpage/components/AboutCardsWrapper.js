import React, { Children } from 'react';

function AboutCardsWrapper(props){
    return(
        <div id="main--container-slider">
            <div id="thumbs">
                {props.children}
            </div>
        </div>
    )
}

export default AboutCardsWrapper;