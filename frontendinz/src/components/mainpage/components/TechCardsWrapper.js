import React, { Children } from 'react';

function TechCardsWrapper(props){
    return(
        <div className="main--wrapper-grid-technology">
                <div className="main--wrapper-card-technology">
                  {props.children}
                </div>
              </div>
    )
}

export default TechCardsWrapper;