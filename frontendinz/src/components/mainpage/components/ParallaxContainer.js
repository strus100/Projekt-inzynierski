import React, { Children } from 'react';

function ParallaxContainer(props){
    return(
        <div className={"parallax-container "+props.classAdditional} id={props.id}>
            {props.children}
        </div>
    )
}

export default ParallaxContainer;